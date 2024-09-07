const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", CounterSchema);


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


UserDetailsSchema.methods.generateId = function (scenarioNumber) {
  if (this.userType === 'Executive') {
    return `WIC0${scenarioNumber}`;
  }
  return this._id.toString(); 
};

UserDetailsSchema.pre('save', async function (next) {
  if (this.isNew && this.userType === 'Executive') {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'executiveScenarioNumber' },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );

      this.id = this.generateId(counter.value);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

mongoose.model("UserInfo", UserDetailsSchema);

