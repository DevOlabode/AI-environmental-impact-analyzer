const mongoose  = require('mongoose');
const { Schema } = mongoose;

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
},
  originCountry: { 
    type: String 
},
owner : { 
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: false 
},
price : {
  type : Number,
  required : false
},
price : {
  type : Number,
  required : false
},
notes : {
  type : String,
  required : false
},
impactAnalysis: {
    type: Schema.Types.ObjectId,
    ref: 'Impact',
    required: false
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
