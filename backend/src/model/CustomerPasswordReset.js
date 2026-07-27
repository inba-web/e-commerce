const mongoose = require("mongoose");

const customerPasswordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

// Automatically expire document after the expiresAt date/time
customerPasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const CustomerPasswordReset = mongoose.model("CustomerPasswordReset", customerPasswordResetSchema);
module.exports = CustomerPasswordReset;
