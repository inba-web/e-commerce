const { default: mongoose } = require("mongoose");
const UserRoles = require("../domain/UserRole");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true, 
  },
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
  ],
  role: {
    type: String,
    enum: [UserRoles.CUSTOMER, UserRoles.ADMIN],
    default: UserRoles.CUSTOMER,
  },
});


const User = mongoose.model("User", userSchema);
module.exports = User;