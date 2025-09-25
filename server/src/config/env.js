// src/config/env.js
require('dotenv').config();

const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Application
  appName: process.env.APP_NAME || 'Aadira Local Market Platform',
  apiPrefix: process.env.API_PREFIX || '/api',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'fallback-jwt-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Database
  databaseUrl: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_URL,
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    if (envVar === 'DATABASE_URL') {
      console.error('💡 Tip: Check your .env file and ensure DATABASE_URL is set');
    }
    process.exit(1);
  }
});

// Log loaded config (without sensitive data)
console.log('🔧 Loaded configuration:');
console.log(`   - Port: ${config.port}`);
console.log(`   - Environment: ${config.nodeEnv}`);
console.log(`   - App Name: ${config.appName}`);
console.log(`   - API Prefix: ${config.apiPrefix}`);

module.exports = config;