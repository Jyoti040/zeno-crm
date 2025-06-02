const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
    field: { type: String, required: true }, // e.g., 'totalSpend', 'visits', 'lastActivity'
    operator: { type: String, required: true }, // e.g., '>', '<', '=', 'inactive_for_days'
    value: { type: mongoose.Schema.Types.Mixed, required: true } // Can be number, string, etc.
});

const segmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    rules: [{
        logic: { type: String, enum: ['AND', 'OR'], default: 'AND' }, // How this rule set combines with the next
        conditions: [ruleSchema]
    }],
    audienceSize: { type: Number, default: 0 }, // To store the previewed size
    createdBy: { type: String } // User ID
}, { timestamps: true });

const Segment = mongoose.model('Segment',segmentSchema) 
module.exports = Segment