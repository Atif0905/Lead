const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  budget: {
    type: String,
    required: true
  },
  pipeline: {
    type: String,
    required: true
  },
  property: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  contactperson: {
    type: String,
  },
  number: {
    type: String,
  },
  comment: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Deal', DealSchema);
