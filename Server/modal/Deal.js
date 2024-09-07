const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  visibleto: {
    type: String,
  },
  persontitle: {
    type: String,
  },
  phone: {
    type: String,
 
  },
  contactperson: {
    type: String,
  
  },
  work1: {
    type: String,
 
  },
  work2: {
    type: String,
  
  },
  email: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Deal', DealSchema);
