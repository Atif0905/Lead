const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    default: 'new'
  },
  assignedto: {
    type: String
  }
});
module.exports = mongoose.model('Lead', LeadSchema);
