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
}, // AI text explaining reasoning
}, 
{ _id: false });

const productSchema =Schema({
  name: { 
    type: String, 
    required: true 
},
  brand: { 
    type: String 
},
  category: { 
    type: String, 
    required: true 
},
  material: { 
    type: String, 
    required: true 
},
  weight: { 
    type: Number 
}, // grams or kg
  originCountry: { 
    type: String 
},
  owner: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'User', 
     required: false 
    },

  // AI-generated environmental analysis
  impactAnalysis: impactSchema,

  // Metadata
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
