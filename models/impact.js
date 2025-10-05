const mongoose  = require('mongoose');
const { Schema } = mongoose;

const impactSchema = Schema({
  carbonFootprint: {
    type: Number,
    required: true
}, // e.g., kg CO2
  waterUsage: {
    type: Number,
    required: true
}, // liters
  recyclability: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
},
  sustainabilityScore: {
    type: Number,
    min: 1,
    max: 10,
    required: true
},
  aiExplanation: {
    type: String
},
});

module.exports = mongoose.model('Impact', impactSchema);