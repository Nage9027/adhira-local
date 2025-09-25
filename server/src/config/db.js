/** @format */

// src/config/db.js
const { PrismaClient } = require('@prisma/client');

// Create a singleton Prisma client instance with proper configuration
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'], // Remove 'query' to reduce noise
  errorFormat: 'pretty',
  // Add datasource configuration to handle prepared statements issue
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Database connection function
const connectDB = async () => {
  try {
    console.log('🔗 Attempting database connection...');
    
    // Test the connection with a simple method that doesn't use prepared statements
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Use a very simple connection test that avoids prepared statements
    try {
      // Use $executeRaw with a simple SQL that doesn't require parameters
      await prisma.$executeRawUnsafe('SELECT 1');
      console.log('✅ Database connection verified successfully');
    } catch (queryError) {
      console.warn('⚠️ First verification failed, trying alternative...');
      
      // Try a different approach - use a transaction that handles connection differently
      await prisma.$transaction(async (tx) => {
        // This often works better with connection pools
        const result = await tx.$executeRawUnsafe('SELECT 1');
        return result;
      });
      console.log('✅ Database connection verified via transaction');
    }
    
    return prisma;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide specific troubleshooting tips
    if (error.code === 'P1001') {
      console.error('💡 Tip: Check if your database server is running');
      console.error('💡 Tip: Verify DATABASE_URL in your .env file');
    } else if (error.message.includes('prepared statement')) {
      console.error('💡 Tip: This is a known issue with PostgreSQL connection pooling');
      console.error('💡 Tip: Try using the Direct URL instead of the pooled connection');
    }
    
    throw error;
  }
};

// Alternative connection method for problematic environments
const testConnectionSimple = async () => {
  try {
    // Use the direct URL to avoid pooling issues
    const { PrismaClient } = require('@prisma/client');
    const testPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DIRECT_URL || process.env.DATABASE_URL
        }
      }
    });
    
    await testPrisma.$connect();
    const result = await testPrisma.$executeRawUnsafe('SELECT 1');
    await testPrisma.$disconnect();
    return true;
  } catch (error) {
    console.error('Alternative connection test failed:', error.message);
    return false;
  }
};

// Graceful shutdown handling
const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected gracefully');
  } catch (error) {
    console.error('❌ Error disconnecting database:', error.message);
  }
};

module.exports = {
  prisma,
  connectDB,
  disconnectDB,
  testConnectionSimple
};