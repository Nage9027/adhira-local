/** @format */

// src/routes/auth.routes.js
const express = require("express");
const {
	registerCustomer,
	registerSeller,
	login,
} = require("../controllers/auth.controller");

const {
	validateCustomerRegistration,
	validateSellerRegistration,
	validateLogin,
} = require("../middlewares/validate.middleware");

const router = express.Router();

// Customer registration route
router.post(
	"/register/customer",
	validateCustomerRegistration,
	registerCustomer
);

// Seller registration route
router.post(
	"/register/seller", 
	validateSellerRegistration, 
	registerSeller
);

// Login route
router.post(
	"/login", 
	validateLogin, 
	login
);

// Add more auth routes here later:
// router.post("/logout", logout);
// router.post("/refresh-token", refreshToken);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);

module.exports = router;