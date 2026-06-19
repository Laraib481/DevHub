const bcrypt = require("bcryptjs");

// How long an OTP stays valid, in minutes. Kept small for security.
const OTP_EXPIRY_MINUTES = 10;

// Generate a random 6-digit numeric OTP as a string (e.g. "048213").
function generateOtp() {
  const code = Math.floor(100000 + Math.random() * 900000);
  return String(code);
}

// Hash an OTP before storing it, so a database leak never exposes a usable code.
async function hashOtp(otp) {
  return bcrypt.hash(otp, 10);
}

// Compare a user-supplied OTP against the stored hash.
async function compareOtp(otp, hashedOtp) {
  if (!hashedOtp) {
    return false;
  }
  return bcrypt.compare(otp, hashedOtp);
}

// Build an expiry timestamp OTP_EXPIRY_MINUTES from now.
function getOtpExpiry() {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

// An OTP is expired when there is no expiry recorded or the time has passed.
function isOtpExpired(expiry) {
  if (!expiry) {
    return true;
  }
  return Date.now() > new Date(expiry).getTime();
}

module.exports = {
  OTP_EXPIRY_MINUTES,
  generateOtp,
  hashOtp,
  compareOtp,
  getOtpExpiry,
  isOtpExpired,
};
