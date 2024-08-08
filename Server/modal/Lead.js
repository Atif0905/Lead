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
   required: true
  },
  title: {
    type: String,
    required: true
  },
  assignedto: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
