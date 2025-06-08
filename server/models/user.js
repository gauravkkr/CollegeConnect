const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: [true, 'Username is required'] },
  password: { type: String, required: [true, 'Password is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: [true, 'Email already exists'] },
  mobile: { type: String, required: [true, 'Mobile number is required'], unique: [true, 'Mobile number already exists'] },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  resetOtp: String,
  resetOtpExpires: Date,
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Sanitize mobile before saving (store only digits)
UserSchema.pre('save', function (next) {
  if (this.isModified('mobile') && this.mobile) {
    this.mobile = String(this.mobile).replace(/\D/g, '');
  }
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);