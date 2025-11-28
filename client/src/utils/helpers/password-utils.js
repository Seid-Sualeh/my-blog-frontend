import bcrypt from 'bcryptjs';

// Password hashing salt rounds
const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 * @param {string} password - Plain text password to hash
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password) => {
  if (!password) {
    throw new Error('Password is required for hashing');
  }
  
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * Verify a plain text password against a hash
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Hashed password to compare against
 * @returns {Promise<boolean>} - True if password matches hash, false otherwise
 */
export const verifyPassword = async (password, hash) => {
  if (!password || !hash) {
    return false;
  }
  
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

/**
 * Store password hash in localStorage
 * @param {string} email - User email
 * @param {string} hash - Hashed password
 */
export const storePasswordHash = (email, hash) => {
  try {
    const passwordKey = `password-hash-${email.toLowerCase()}`;
    localStorage.setItem(passwordKey, hash);
  } catch (error) {
    console.error('Error storing password hash:', error);
  }
};

/**
 * Get password hash from localStorage
 * @param {string} email - User email
 * @returns {string|null} - Hashed password or null if not found
 */
export const getPasswordHash = (email) => {
  try {
    const passwordKey = `password-hash-${email.toLowerCase()}`;
    return localStorage.getItem(passwordKey);
  } catch (error) {
    console.error('Error getting password hash:', error);
    return null;
  }
};

/**
 * Remove password hash from localStorage (for logout)
 * @param {string} email - User email
 */
export const removePasswordHash = (email) => {
  try {
    const passwordKey = `password-hash-${email.toLowerCase()}`;
    localStorage.removeItem(passwordKey);
  } catch (error) {
    console.error('Error removing password hash:', error);
  }
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validatePasswordStrength = (password) => {
  const result = {
    isValid: true,
    message: ''
  };
  
  if (!password) {
    result.isValid = false;
    result.message = 'Password is required';
    return result;
  }
  
  if (password.length < 6) {
    result.isValid = false;
    result.message = 'Password must be at least 6 characters long';
    return result;
  }
  
  if (password.length < 8) {
    result.message = 'Consider using at least 8 characters for better security';
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    result.message = 'Consider including at least one number for better security';
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    result.message = 'Consider including at least one uppercase letter for better security';
  }
  
  return result;
};