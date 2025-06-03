const Segment = require('../models/segment')
const Campaign = require('../models/campaign');
const Customer = require('../models/customer');
const CommunicationLog = require('../models/communicationLog');
const CustomAPIError = require('../error/CustomError')
const axios = require('axios'); 

// Helper function to apply segment rules (simplified for demonstration)
const applySegmentRules = async (rules) => {
    let query = {};
    rules.forEach(ruleGroup => {
        ruleGroup.conditions.forEach(condition => {
            const { field, operator, value } = condition;
            switch (operator) {
                case '>':
                    query[field] = { $gt: value };
                    break;
                case '<':
                    query[field] = { $lt: value };
                    break;
                case '=':
                    query[field] = value;
                    break;
                case 'inactive_for_days':
                    // Calculate date 'value' days ago
                    const cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - value);
                    query.lastActivity = { $lt: cutoffDate };
                    break;
                // Add more operators as needed
            }
        });
    });
    return await Customer.find(query).select('_id name email'); // Select only necessary fields
};

// Dummy Vendor API Simulation
const sendToDummyVendor = async (customerId, message) => {
    // Simulate API call to a vendor
    return new Promise(resolve => {
        setTimeout(() => {
            const success = Math.random() > 0.1; // ~90% SENT, ~10% FAILED
            resolve({
                success,
                vendorMessageId: success ? `msg_${Date.now()}_${customerId}` : null,
                status: success ? 'SENT' : 'FAILED',
                message: success ? 'Message sent successfully' : 'Failed to send message'
            });
        }, 500); // Simulate network delay
    });
};

const createSegment = async (req, res , next) => {
    const { name, rules } = req.body;
    // const createdBy = req.user.id; // Get from authenticated user

    try {
        if (!name || !rules || rules.length === 0) {
            throw new CustomAPIError('Segment name and rules are required', 400);
        }

        let segment = await Segment.findOne({ name });
        if (segment) {
            throw new CustomAPIError('Segment with this name already exists', 400);
        }

        // Preview audience size before saving
        const audience = await applySegmentRules(rules);
        const audienceSize = audience.length;

        segment = new Segment({ name, rules, audienceSize, createdBy: 'dummy_user_id' }); // Replace dummy_user_id
        await segment.save();

        res
          .status(201)
          .json({
            status:'success',
            segment
          });
    } catch (error) {
        next(error)
    }
};

const previewAudience = async (req, res,next) => {
    const { rules } = req.body;
    try {
        if (!rules || rules.length === 0) {
            throw new CustomAPIError('Rules are required for audience preview', 400);
        }
        const audience = await applySegmentRules(rules);
        res
          .status(200)
          .json({ audienceSize: audience.length });
    } catch (error) {
        next(error)
    }
};

const getAllSegments = async (req, res,next) => {
    try {
        const segments = await Segment.find();
        res
          .status(200)
          .json({
            status:'success',

            segments
          });
    } catch (error) {
        next(error)
    }
};

const createCampaign = async (req, res , next) => {
    console.log("in create campaign ",req.body)
    const { name, segmentId, messageTemplate } = req.body;
    // const createdBy = req.user.id; // Get from authenticated user

    try {
        if (!name || !segmentId || !messageTemplate) {
            throw new CustomAPIError('Campaign name, segment ID, and message template are required', 400);
        }

        const segment = await Segment.findById(segmentId);
        if (!segment) {
            throw new CustomAPIError('Segment not found', 404);
        }

        // Get audience for the campaign
        const audience = await applySegmentRules(segment.rules);
        const audienceSize = audience.length;

        const campaign = new Campaign({
            name,
            segmentId,
            messageTemplate,
            deliveryStats: { audienceSize },
            status: 'InProgress',
            createdBy: 'dummy_user_id' // Replace dummy_user_id
        });
        await campaign.save();

        // Asynchronously send messages (in a real app, this would be a background job/queue)
        for (const customer of audience) {
            const personalizedMessage = message.replace('{customerName}', customer.name);
            const { success, vendorMessageId, status } = await sendToDummyVendor(customer._id, personalizedMessage);

            const log = new CommunicationLog({
                campaignId: campaign._id,
                customerId: customer._id,
                message: personalizedMessage,
                deliveryStatus: status === 'SENT' ? 'Sent' : 'Failed',
                vendorMessageId: vendorMessageId,
                sentAt: Date.now()
            });
            await log.save();

            // Update campaign stats immediately (or via batch processing)
            if (success) {
                campaign.deliveryStats.sent += 1;
            } else {
                campaign.deliveryStats.failed += 1;
            }
            await campaign.save(); // Save after each message or in batches
        }

        campaign.status = 'Completed';
        campaign.completedAt = Date.now();
        await campaign.save();

        res
          .status(201)
          .json({
            status:'success',
            segment
          });
    } catch (error) {
        next(error)
    }
};

const getAllCampaigns = async (req, res,next) => {
    try {
        const campaigns = await Campaign.find().populate('segmentId', 'name');
        res
          .status(200)
          .json({
              status:'success',
              campaigns
          });
    } catch (error) {
      next(error)
    }
};

const handleDeliveryReceipt = async (req, res,next) => {
    const { vendorMessageId, status } = req.body; // status: 'DELIVERED', 'FAILED', 'READ' etc.

    try {
        if (!vendorMessageId || !status) {
            throw new CustomAPIError('Vendor message ID and status are required', 400);
        }

        const communicationLog = await CommunicationLog.findOneAndUpdate(
            { vendorMessageId },
            { deliveryStatus: status, deliveredAt: Date.now() },
            { new: true } // Return the updated document
        );

        if (!communicationLog) {
             throw new CustomAPIError('Communication log not found for this vendor message ID', 400);
        }

        res
          .status(200)
          .json({ msg: 'Delivery receipt processed', communicationLog });
    } catch (error) {
        next(error)
    }
};

module.exports = {
    applySegmentRules,
    sendToDummyVendor,
    createSegment,
    previewAudience,
    createCampaign,
    getAllCampaigns,
    getAllSegments,
    handleDeliveryReceipt
}

