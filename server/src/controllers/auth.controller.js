/** @format */

const authService = require("../services/auth.service");
const { successResponse, errorResponse } = require("../utils/response");

const registerCustomer = async (req, res) => {
	try {
		const { fullName, email, mobileNumber, address, password } = req.body;

		// Validate required fields
		if (!fullName || !email || !mobileNumber || !address || !password) {
			return errorResponse(res, "All fields are required", 400);
		}

		// Check if user already exists
		const existingUser = await authService.checkEmailExists(email);
		if (existingUser) {
			return errorResponse(res, "User already exists with this email", 400);
		}

		// Hash password
		const hashedPassword = await authService.hashPassword(password);

		// Create user data - Use UPPERCASE for role to match Prisma enum
		const userData = {
			fullName,
			email,
			mobileNumber,
			password: hashedPassword,
			role: "CUSTOMER", // Changed to uppercase
		};

		// Create customer data
		const customerData = { address };

		// Create customer
		const result = await authService.createCustomer(userData, customerData);

		// Generate token AFTER user creation (with user ID)
		const token = authService.generateToken({
			id: result.user.id,
			email: result.user.email,
			role: result.user.role,
		});

		// Update user token in database
		await authService.updateUserToken(result.user.id, token);

		// Remove password from response
		const { password: _, ...userWithoutPassword } = result.user;

		console.log("Customer account created successfully");
		return successResponse(
			res,
			"Customer account created successfully",
			{ 
				user: userWithoutPassword, 
				token,
				redirectTo: "/homepage" // Add this for frontend guidance
			},
			201,
		);
	} catch (error) {
		console.error("Customer registration error:", error);
		return errorResponse(res, "Internal server error", 500, error.message);
	}
};

const registerSeller = async (req, res) => {
	try {
		const {
			fullName,
			email,
			mobileNumber,
			shopName,
			shopDescription,
			businessAddress,
			password,
		} = req.body;

		// Validate required fields
		if (!fullName || !email || !mobileNumber || !shopName || !businessAddress || !password) {
			return errorResponse(res, "All fields are required", 400);
		}

		// Check if user already exists
		const existingUser = await authService.checkEmailExists(email);
		if (existingUser) {
			return errorResponse(res, "User already exists with this email", 400);
		}

		// Hash password
		const hashedPassword = await authService.hashPassword(password);

		// Create user data - Use UPPERCASE for role
		const userData = {
			fullName,
			email,
			mobileNumber,
			password: hashedPassword,
			role: "SELLER", // Changed to uppercase
		};

		// Create seller data
		const sellerData = {
			shopName,
			shopDescription,
			businessAddress,
		};

		// Create seller
		const result = await authService.createSeller(userData, sellerData);

		// Generate token AFTER user creation
		const token = authService.generateToken({
			id: result.user.id,
			email: result.user.email,
			role: result.user.role,
		});

		// Update user token in database
		await authService.updateUserToken(result.user.id, token);

		// Remove password from response
		const { password: _, ...userWithoutPassword } = result.user;

		console.log("Seller account created successfully");
		return successResponse(
			res,
			"Seller account created successfully",
			{ 
				user: userWithoutPassword, 
				token,
				redirectTo: "/seller-dashboard" // Add redirect hint
			},
			201,
		);
	} catch (error) {
		console.error("Seller registration error:", error);
		return errorResponse(res, "Internal server error", 500, error.message);
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate required fields
		if (!email || !password) {
			return errorResponse(res, "Email and password are required", 400);
		}

		// Find user by email
		const user = await authService.findUserByEmail(email);

		if (!user) {
			return errorResponse(res, "Invalid email or password", 401);
		}

		// Verify password
		const isPasswordValid = await authService.verifyPassword(
			password,
			user.password,
		);

		if (!isPasswordValid) {
			return errorResponse(res, "Invalid email or password", 401);
		}

		// Generate new token
		const token = authService.generateToken({
			id: user.id,
			email: user.email,
			role: user.role,
		});

		// Update user token in database
		await authService.updateUserToken(user.id, token);

		// Prepare user data without password
		const { password: _, ...userWithoutPassword } = user;

		// Include additional data based on role
		let userData = { ...userWithoutPassword };
		if (user.role === "CUSTOMER" && user.customer) {
			userData.address = user.customer.address;
		} else if (user.role === "SELLER" && user.seller) {
			userData.shopName = user.seller.shopName;
			userData.shopDescription = user.seller.shopDescription;
			userData.businessAddress = user.seller.businessAddress;
		}

		// Determine redirect path based on role
		const redirectTo = user.role === "SELLER" ? "/seller-dashboard" : "/homepage";

		console.log("Login successful");
		return successResponse(
			res,
			"Login successful",
			{ 
				user: userData, 
				token,
				redirectTo 
			},
			200,
		);
	} catch (error) {
		console.error("Login error:", error);
		return errorResponse(res, "Internal server error", 500, error.message);
	}
};

module.exports = {
	registerCustomer,
	registerSeller,
	login,
};