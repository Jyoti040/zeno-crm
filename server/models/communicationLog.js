const mongoose = require('mongoose')

const communicationLogSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    message: { type: String, required: true },
    deliveryStatus: { type: String, enum: ['Pending', 'Sent', 'Failed', 'Delivered', 'Read'], default: 'Pending' },
    vendorMessageId: { type: String }, // ID from dummy vendor API
    sentAt: { type: Date, default: Date.now },
    deliveredAt: { type: Date }
},{
    timestamps:true
})

const CommunicationLog = mongoose.model('CommunicationLog',communicationLogSchema) 
module.exports = CommunicationLog