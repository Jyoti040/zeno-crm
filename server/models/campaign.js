// crm-backend/models/Campaign.js
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    segmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Segment', required: true },
    messageTemplate: { type: String, required: true },
    deliveryStats: {
        sent: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        audienceSize: { type: Number, default: 0 }
    },
    status: { type: String, enum: ['Draft', 'Scheduled', 'InProgress', 'Completed'], default: 'Draft' },
    scheduledAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    createdBy: { type: String }
}, { timestamps: true });

// Check if the model already exists before defining it.
// This prevents the OverwriteModelError when the file might be required multiple times.
module.exports = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);
