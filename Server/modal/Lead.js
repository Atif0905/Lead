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
  }
});

// Function to create lead document dynamically based on column count
LeadSchema.statics.createLeadDocument = async function(data) {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const leadData = {};
    for (let i = 0; i < keys.length; i++) {
      leadData[keys[i]] = values[i];
    }

    await this.create(leadData);
  } catch (error) {
    throw new Error(`Error creating lead document: ${error.message}`);
  }
};

module.exports = mongoose.model('Lead', LeadSchema);
