const mongoose  = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: { type: String },
  locality: { type: String },
  pincode: { type: String },
  pinCode: { type: String }, // support camelCase
  statue: { type: String },
  state: { type: String },   // support standard field
  address: { type: String },
  streetAddress: { type: String }, // support standard field
  city: { type: String },
  mobile: { type: String },
},{
    timestamps:true
});

const Address = mongoose.model("Address", addressSchema)
module.exports = Address;