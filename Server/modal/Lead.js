const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false,
    unique: false, 
  },
  number: {
    type: String,
    required: false,
  },
  status: {
    type: String,
   required: false
  },
  title: {
    type: String,
    required: false
  },
  assignedto: {
    type: String,
   required: false
  },
  contactperson1: {
    type: String,
    required: false
  },
  budget: {
    type: String,
    required: false
  },
  pipeline: {
    type: String,
    required: false
  },
  property: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: false
  },
  contactperson2: {
    type: String,
  },
  contactnumber: {
    type: String,
  },
  comment: {
    type: String,
  },
  lostreason: {
    type: String,
  },
  lostcomment: {
    type: String,
  },

}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
