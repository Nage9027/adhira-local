/** @format */

// src/utils/jwt.util.js
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

const generateToken = (payload) => {
  try {
    return jwt.sign(payload, jwtSecret, { 
      expiresIn: jwtExpiresIn,
      issuer: 'aadira-backend',
      audience: 'aadira-users'
    });
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate authentication token');
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtSecret, {
      issuer: 'aadira-backend',
      audience: 'aadira-users'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Token decoding error:', error);
    return null;
  }
};

const getTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    return null;
  }
  
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  
  return null;
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  getTokenFromHeader
};