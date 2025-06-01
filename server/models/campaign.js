const mongoose = require('mongoose')

const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    message: { type: String, required: true },
    deliveryStats: {
        sent: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
    },
    audienceSize:{ type: Number, default: 0 },
    status: { type: String, enum: ['Draft', 'Scheduled', 'InProgress', 'Completed'], default: 'Draft' },
    scheduledAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    createdBy: { type: String } 
},{
    timestamps:true
})

const Campaign = mongoose.model('Campaign',campaignSchema) 
module.exports = Campaign