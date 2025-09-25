/** @format */

const express = require('express');
const { getProfile, updateProfile, changePassword } = require('../controllers/profile.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { validateCustomerRegistration, validateSellerRegistration } = require('../middlewares/validate.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/profile - Get user profile
router.get('/', getProfile);

// PUT /api/profile - Update user profile
router.put('/', 
  (req, res, next) => {
    // Determine which validation to use based on the user's role
    if (req.user && req.user.role === 'SELLER') {
      return validateSellerRegistration(req, res, next);
    }
    return validateCustomerRegistration(req, res, next);
  },
  updateProfile
);

// PUT /api/profile/password - Change password
router.put('/password',
  (req, res, next) => {
    // A simple validation for password change, assuming it's a new middleware
    // This part requires you to have a validation for password change in your middleware
    // For now, this is a placeholder. If you have a specific validation for password, use it here.
    // For example:
    // return validatePasswordChange(req, res, next);
    // For this example, let's assume a basic check is enough
    if (!req.body.currentPassword || !req.body.newPassword || !req.body.confirmPassword) {
      return res.status(400).json({ success: false, message: 'All password fields are required.' });
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({ success: false, message: 'New passwords do not match.' });
    }
    if (req.body.newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }
    next();
  },
  changePassword
);

module.exports = router;
