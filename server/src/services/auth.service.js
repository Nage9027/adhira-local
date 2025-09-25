/** @format */

// src/services/auth.service.js
const bcrypt = require("bcryptjs");
const { prisma } = require("../config/db"); // Import the prisma instance correctly
const jwtUtil = require("../utils/jwt.util"); // Import entire jwtUtil object

const safeQuery = async (queryFunc) => {
	try {
		return await queryFunc();
	} catch (error) {
		if (
			error.message.includes("prepared statement") ||
			error.code === "42P05"
		) {
			console.warn("Prepared statement error, retrying...");
			// Wait a bit and retry
			await new Promise((resolve) => setTimeout(resolve, 100));
			return await queryFunc();
		}
		throw error;
	}
};

const checkEmailExists = async (email) => {
	try {
		return await safeQuery(() =>
			prisma.user.findUnique({
				where: { email },
			})
		);
	} catch (error) {
		console.error("Error checking email exists:", error);
		throw new Error("Database error while checking email");
	}
};

const hashPassword = async (password) => {
	try {
		const saltRounds = 10;
		return await bcrypt.hash(password, saltRounds);
	} catch (error) {
		console.error("Error hashing password:", error);
		throw new Error("Error hashing password");
	}
};

const verifyPassword = async (password, hashedPassword) => {
	try {
		return await bcrypt.compare(password, hashedPassword);
	} catch (error) {
		console.error("Error verifying password:", error);
		throw new Error("Error verifying password");
	}
};

const generateToken = (payload) => {
	try {
		return jwtUtil.generateToken(payload);
	} catch (error) {
		console.error("Error generating token:", error);
		throw new Error("Error generating token");
	}
};

const findUserByEmail = async (email) => {
	try {
		return await safeQuery(() =>
			prisma.user.findUnique({
				where: { email },
				include: {
					customer: true,
					seller: true,
				},
			})
		);
	} catch (error) {
		console.error("Error finding user by email:", error);
		throw new Error("Database error while finding user");
	}
};

const updateUserToken = async (userId, token) => {
	try {
		return await safeQuery(() =>
			prisma.user.update({
				where: { id: userId },
				data: { token },
			})
		);
	} catch (error) {
		console.error("Error updating user token:", error);
		throw new Error("Error updating user token");
	}
};

// Customer creation function
const createCustomer = async (userData, customerData) => {
	try {
		return await prisma.$transaction(async (tx) => {
			// Create user first
			const user = await tx.user.create({
				data: {
					fullName: userData.fullName,
					email: userData.email,
					mobileNumber: userData.mobileNumber,
					password: userData.password,
					role: userData.role,
				},
			});

			// Then create customer
			const customer = await tx.customer.create({
				data: {
					address: customerData.address,
					userId: user.id,
				},
			});

			return { 
				user: {
					...user,
					customer: customer
				} 
			};
		});
	} catch (error) {
		console.error("Error creating customer:", error);
		throw new Error("Error creating customer account");
	}
};

// Seller creation function
const createSeller = async (userData, sellerData) => {
	try {
		return await prisma.$transaction(async (tx) => {
			// Create user first
			const user = await tx.user.create({
				data: {
					fullName: userData.fullName,
					email: userData.email,
					mobileNumber: userData.mobileNumber,
					password: userData.password,
					role: userData.role,
				},
			});

			// Then create seller
			const seller = await tx.seller.create({
				data: {
					shopName: sellerData.shopName,
					shopDescription: sellerData.shopDescription || "",
					businessAddress: sellerData.businessAddress,
					userId: user.id,
				},
			});

			return { 
				user: {
					...user,
					seller: seller
				} 
			};
		});
	} catch (error) {
		console.error("Error creating seller:", error);
		throw new Error("Error creating seller account");
	}
};

module.exports = {
	checkEmailExists,
	hashPassword,
	verifyPassword,
	generateToken, // Fixed: Now properly exported
	findUserByEmail,
	updateUserToken,
	createCustomer,
	createSeller,
};