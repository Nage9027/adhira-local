/** @format */

const express = require('express');
const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const { prisma } = require('../config/db');

const router = express.Router();

// ======================
// HEALTH CHECK ENDPOINT
// ======================
router.get('/health', async (req, res) => {
  try {
    console.log('🔍 Health check requested');
    
    // Database connection test
    await prisma.$queryRaw`SELECT 1`;
    
    const healthInfo = {
      success: true,
      message: '🚀 API Server is healthy and running!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: '✅ Connected',
      version: '1.0.0',
      uptime: `${process.uptime().toFixed(2)} seconds`
    };

    console.log('✅ Health check passed');
    res.status(200).json(healthInfo);
  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    const errorResponse = {
      success: false,
      message: '💥 API Server health check failed',
      timestamp: new Date().toISOString(),
      database: '❌ Disconnected',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Database connection error'
    };

    res.status(503).json(errorResponse);
  }
});

// ======================
// ROOT API ENDPOINT
// ======================
router.get('/', (req, res) => {
  const apiInfo = {
    success: true,
    message: '🛍️ Welcome to Adhira Local Market API',
    description: 'A marketplace platform connecting local sellers with customers',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        registerCustomer: 'POST /api/auth/register/customer',
        registerSeller: 'POST /api/auth/register/seller'
      },
      profile: {
        getProfile: 'GET /api/profile',
        updateProfile: 'PUT /api/profile',
        changePassword: 'PUT /api/profile/password'
      },
      health: 'GET /api/health',
      docs: 'GET /api/docs'
    },
    documentation: 'Visit /api/docs for detailed API documentation'
  };

  res.status(200).json(apiInfo);
});

// ======================
// API DOCUMENTATION
// ======================
router.get('/docs', (req, res) => {
  const apiDocs = {
    success: true,
    message: '📚 Adhira API Documentation',
    version: '1.0.0',
    baseUrl: `${req.protocol}://${req.get('host')}/api`,
    endpoints: {
      // Authentication Endpoints
      auth: {
        'POST /auth/login': {
          description: 'User login',
          body: {
            email: 'string (required)',
            password: 'string (required)'
          }
        },
        'POST /auth/register/customer': {
          description: 'Register as customer',
          body: {
            fullName: 'string (required)',
            email: 'string (required)',
            mobileNumber: 'string (required)',
            address: 'string (required)',
            password: 'string (required)',
            confirmPassword: 'string (required)'
          }
        },
        'POST /auth/register/seller': {
          description: 'Register as seller',
          body: {
            fullName: 'string (required)',
            email: 'string (required)',
            mobileNumber: 'string (required)',
            shopName: 'string (required)',
            shopDescription: 'string (required)',
            businessAddress: 'string (required)',
            password: 'string (required)',
            confirmPassword: 'string (required)'
          }
        }
      },
      
      // Profile Endpoints (Authentication Required)
      profile: {
        'GET /profile': {
          description: 'Get user profile',
          headers: {
            Authorization: 'Bearer <token>'
          }
        },
        'PUT /profile': {
          description: 'Update user profile',
          headers: {
            Authorization: 'Bearer <token>'
          },
          body: 'Partial user data'
        },
        'PUT /profile/password': {
          description: 'Change password',
          headers: {
            Authorization: 'Bearer <token>'
          },
          body: {
            currentPassword: 'string (required)',
            newPassword: 'string (required)',
            confirmPassword: 'string (required)'
          }
        }
      },
      
      // Utility Endpoints
      utility: {
        'GET /health': 'Check API health status',
        'GET /': 'API information',
        'GET /docs': 'This documentation'
      }
    },
    authentication: {
      type: 'Bearer Token',
      description: 'Most endpoints require JWT authentication. Include token in Authorization header.'
    },
    errorResponses: {
      '400': 'Bad Request - Invalid input data',
      '401': 'Unauthorized - Invalid or missing token',
      '404': 'Not Found - Resource not found',
      '500': 'Internal Server Error'
    }
  };

  res.status(200).json(apiDocs);
});

// ======================
// API ROUTES MOUNTING
// ======================

// Authentication routes
router.use('/auth', authRoutes);

// Profile routes (protected)
router.use('/profile', profileRoutes);

// ======================
// 404 HANDLER FOR UNDEFINED API ROUTES
// ======================
router.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '🔍 API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/docs',
      'POST /api/auth/login',
      'POST /api/auth/register/customer',
      'POST /api/auth/register/seller',
      'GET /api/profile (auth required)',
      'PUT /api/profile (auth required)'
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;