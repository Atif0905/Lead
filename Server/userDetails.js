const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", CounterSchema);

// Schema for user details
const UserDetailsSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: { type: String, unique: true },
    password: String,
    userType: String,
    key: String,
    key1: String,
    id: String,  
  },
  {
    collection: "UserInfo",
  }
);

// Custom method to generate an ID for specific scenarios
UserDetailsSchema.methods.generateId = function (scenarioNumber) {
   // If the user type is 'Executive', generate an ID with a prefix and scenario number
  if (this.userType === 'Executive') {
    return `WIC0${scenarioNumber}`;
  }
   // For other user types, default to using the MongoDB object ID
  return this._id.toString(); 
};
// Middleware to execute before saving a new user 
UserDetailsSchema.pre('save', async function (next) {
   // Check if the user is new and the user type is 'Executive'
  if (this.isNew && this.userType === 'Executive') {
    try {
  // Find and increment the counter for the 'executiveScenarioNumber'
      // If the counter does not exist, create it (upsert)
      const counter = await Counter.findOneAndUpdate(
        { name: 'executiveScenarioNumber' },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
 // Generate a unique ID using the incremented counter value
      this.id = this.generateId(counter.value);
    } catch (err) {
      return next(err);
    }
  }
   // Proceed to save the document
  next();
});

mongoose.model("UserInfo", UserDetailsSchema);

