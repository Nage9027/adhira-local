/** @format */

const { prisma } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Get user profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        mobileNumber: true,
        role: true,
        address: true,
        shopName: true,
        shopDescription: true,
        businessAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, 'Profile fetched successfully', { user });
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, 'Failed to fetch profile');
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      fullName,
      mobileNumber,
      address,
      shopName,
      shopDescription,
      businessAddress,
    } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return errorResponse(res, 'User not found', 404);
    }

    // Prepare update data based on user role
    const updateData = {
      fullName: fullName || existingUser.fullName,
      mobileNumber: mobileNumber || existingUser.mobileNumber,
    };

    // Add role-specific fields
    if (existingUser.role === 'customer') {
      updateData.address = address || existingUser.address;
    } else if (existingUser.role === 'seller') {
      updateData.shopName = shopName || existingUser.shopName;
      updateData.shopDescription = shopDescription || existingUser.shopDescription;
      updateData.businessAddress = businessAddress || existingUser.businessAddress;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        mobileNumber: true,
        role: true,
        address: true,
        shopName: true,
        shopDescription: true,
        businessAddress: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(res, 'Profile updated successfully', { user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, 'Failed to update profile');
  }
};

/**
 * Change password
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate passwords
    if (newPassword !== confirmPassword) {
      return errorResponse(res, 'New passwords do not match');
    }

    if (newPassword.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters long');
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // TODO: Implement password verification
    // For now, we'll assume current password is correct
    // In a real app, you'd verify the current password using bcrypt

    // Update password (you should hash the password before saving)
    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword }, // Remember to hash this in production
    });

    return successResponse(res, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse(res, 'Failed to change password');
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};