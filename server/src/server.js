require('dotenv').config({ path: '.env' });
const app = require('./app');
const { connectDB, prisma, testConnectionSimple } = require('./config/db');
const config = require('./config/env');

const startServer = async () => {
  try {
    console.log('🚀 Starting Aadira Backend Server...');
    console.log('📋 Environment:', config.nodeEnv);

    // First connect to database with retry logic
    console.log('🔗 Connecting to database...');
    
    let dbConnected = false;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (!dbConnected && retryCount < maxRetries) {
      try {
        await connectDB();
        dbConnected = true;
        console.log('✅ Database connection established successfully');
      } catch (dbError) {
        retryCount++;
        console.error(`❌ Database connection attempt ${retryCount} failed:`, dbError.message);
        
        if (retryCount < maxRetries) {
          console.log(`🔄 Retrying database connection in 3 seconds... (${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          console.error('💥 All database connection attempts failed');
          
          // Try the simple connection test as last resort
          console.log('🔄 Attempting alternative connection method...');
          const simpleTest = await testConnectionSimple();
          if (simpleTest) {
            console.log('✅ Alternative connection test passed - proceeding with caution');
            dbConnected = true;
          } else {
            throw new Error('Database connection failed after all attempts');
          }
        }
      }
    }

    // Then start the server
    const server = app.listen(config.port, () => {
      console.log('✅ Server started successfully!');
      console.log('🌐 Server Info:');
      console.log('   - Port:', config.port);
      console.log('   - Environment:', config.nodeEnv);
      console.log('   - App Name:', config.appName);
      console.log('   - API Base URL:', `http://localhost:${config.port}${config.apiPrefix}`);
      console.log('   - Health Check:', `http://localhost:${config.port}/api/health`);
      console.log('   - API Docs:', `http://localhost:${config.port}/api/docs`);
      console.log('\n📊 Available Endpoints:');
      console.log('   - Customer Register: POST /api/auth/register/customer');
      console.log('   - Seller Register: POST /api/auth/register/seller');
      console.log('   - Login: POST /api/auth/login');
      console.log('   - Health Check: GET /api/health');
      console.log('\n⚡ Server is ready to handle requests!');
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        console.log('✅ HTTP server closed.');
        const { disconnectDB } = require('./config/db');
        await disconnectDB();
        console.log('✅ Database connection closed.');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    
    return server;
  } catch (error) {
    console.error('💥 Failed to start server:', error.message);
    
    // Specific error handling
    if (error.message.includes('prepared statement')) {
      console.error('\n💡 SOLUTION: This is a PostgreSQL connection pooling issue.');
      console.error('💡 Try these fixes:');
      console.error('   1. Use the DIRECT_URL instead of DATABASE_URL in your .env');
      console.error('   2. Add ?pgbouncer=true to your DATABASE_URL');
      console.error('   3. Restart your database connection pool');
    }
    
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();