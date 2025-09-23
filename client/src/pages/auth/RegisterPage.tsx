/** @format */
import { isStrongPassword } from "../../utils/validatePassword";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Eye,
	EyeOff,
	Mail,
	Lock,
	User,
	Phone,
	MapPin,
	Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API_BASE_URL =
	import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface RegisterResponse {
	success: boolean;
	message: string;
	data: {
		user: {
			id: string;
			fullName: string;
			email: string;
			mobileNumber: string;
			role: string;
			createdAt: string;
			updatedAt: string;
		};
		token: string;
	};
}

const RegisterPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [userType, setUserType] = useState("customer");
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		mobileNumber: "",
		password: "",
		confirmPassword: "",
		address: "",
		shopName: "",
		shopDescription: "",
		businessAddress: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		// ✅ Password strength check
		if (!isStrongPassword(formData.password)) {
			setError(
				"Password must be at least 8 characters long, include uppercase, lowercase, number, and special character."
			);
			setLoading(false);
			return;
		}

		// ✅ Confirm password check
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match.");
			setLoading(false);
			return;
		}

		try {
			const endpoint =
				userType === "customer"
					? `${API_BASE_URL}/auth/register/customer`
					: `${API_BASE_URL}/auth/register/seller`;

			const requestData =
				userType === "customer"
					? {
							fullName: formData.fullName,
							email: formData.email,
							mobileNumber: formData.mobileNumber,
							address: formData.address,
							password: formData.password,
							confirmPassword: formData.confirmPassword,
					  }
					: {
							fullName: formData.fullName,
							email: formData.email,
							mobileNumber: formData.mobileNumber,
							shopName: formData.shopName,
							shopDescription: formData.shopDescription,
							businessAddress: formData.businessAddress,
							password: formData.password,
							confirmPassword: formData.confirmPassword,
					  };

			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestData),
			});

			const data: RegisterResponse = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Registration failed");
			}

			if (data.success) {
				// Save token to localStorage
				localStorage.setItem("token", data.data.token);
				localStorage.setItem("user", JSON.stringify(data.data.user));

				// Redirect based on user type
				if (userType === "customer") {
					navigate("/");
				} else {
					navigate("/seller/dashboard");
				}
			}
		} catch (err: any) {
			console.error("Registration failed:", err);
			setError(err.message || "Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const updateFormData = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo */}
				<div className="text-center mb-8">
					<Link
						to="/"
						className="inline-flex items-center space-x-2">
						<div className="bg-gradient-to-r from-primary to-accent p-3 rounded-xl">
							<span className="text-white font-bold text-2xl">A</span>
						</div>
						<span className="text-gradient font-bold text-3xl">Adhira</span>
					</Link>
					<p className="text-muted-foreground mt-2">
						Join the marketplace community
					</p>
				</div>

				<Card className="shadow-medium border-0">
					<CardHeader>
						<CardTitle className="text-2xl text-center">
							Create Account
						</CardTitle>
						<CardDescription className="text-center">
							Choose your account type to get started
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs
							value={userType}
							onValueChange={(value) => setUserType(value)}
							className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="customer">Customer</TabsTrigger>
								<TabsTrigger value="seller">Seller</TabsTrigger>
							</TabsList>

							{/* ---------------- CUSTOMER FORM ---------------- */}
							<TabsContent value="customer">
								<form
									onSubmit={handleRegister}
									className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="fullName">Full Name</Label>
										<div className="relative">
											<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="fullName"
												type="text"
												placeholder="Enter your full name"
												value={formData.fullName}
												onChange={(e) =>
													updateFormData("fullName", e.target.value)
												}
												className="pl-10"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="email">Email Address</Label>
										<div className="relative">
											<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="email"
												type="email"
												placeholder="Enter your email"
												value={formData.email}
												onChange={(e) =>
													updateFormData("email", e.target.value)
												}
												className="pl-10"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="mobileNumber">Mobile Number</Label>
										<div className="relative">
											<Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="mobileNumber"
												type="tel"
												placeholder="Enter your mobile number"
												value={formData.mobileNumber}
												onChange={(e) =>
													updateFormData("mobileNumber", e.target.value)
												}
												className="pl-10"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="address">Address</Label>
										<div className="relative">
											<MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="address"
												type="text"
												placeholder="Enter your address"
												value={formData.address}
												onChange={(e) =>
													updateFormData("address", e.target.value)
												}
												className="pl-10"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="password">Password</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="password"
												type={showPassword ? "text" : "password"}
												placeholder="Create a password"
												value={formData.password}
												onChange={(e) =>
													updateFormData("password", e.target.value)
												}
												className="pl-10 pr-10"
												required
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
												onClick={() => setShowPassword(!showPassword)}>
												{showPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="confirmPassword">Confirm Password</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="confirmPassword"
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Confirm your password"
												value={formData.confirmPassword}
												onChange={(e) =>
													updateFormData("confirmPassword", e.target.value)
												}
												className="pl-10 pr-10"
												required
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
												onClick={() =>
													setShowConfirmPassword(!showConfirmPassword)
												}>
												{showConfirmPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>

									<Button
										type="submit"
										className="w-full btn-hero"
										disabled={loading}>
										{loading ? "Creating..." : "Create Customer Account"}
									</Button>
								</form>
							</TabsContent>

							{/* ---------------- SELLER FORM ---------------- */}
							<TabsContent value="seller">
								<form
									onSubmit={handleRegister}
									className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="sellerFullName">Full Name</Label>
										<div className="relative">
											<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="sellerFullName"
												type="text"
												placeholder="Enter your full name"
												value={formData.fullName}
												onChange={(e) =>
													updateFormData("fullName", e.target.value)
												}
												className="pl-10"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="sellerEmail">Email Address</Label>
										<div className="relative">
											<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="sellerEmail"
												type="email"
												placeholder="Enter your email"
												value={formData.email}
												onChange={(e) =>
													updateFormData("email", e.target.value)
												}
												className="pl-10"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="sellerMobile">Mobile Number</Label>
										<div className="relative">
											<Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="sellerMobile"
												type="tel"
												placeholder="Enter your mobile number"
												value={formData.mobileNumber}
												onChange={(e) =>
													updateFormData("mobileNumber", e.target.value)
												}
												className="pl-10"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="shopName">Shop Name</Label>
										<div className="relative">
											<Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="shopName"
												type="text"
												placeholder="Enter your shop name"
												value={formData.shopName}
												onChange={(e) =>
													updateFormData("shopName", e.target.value)
												}
												className="pl-10"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="shopDescription">Shop Description</Label>
										<Textarea
											id="shopDescription"
											placeholder="Tell us about your shop..."
											value={formData.shopDescription}
											onChange={(e) =>
												updateFormData("shopDescription", e.target.value)
											}
											rows={3}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="businessAddress">Business Address</Label>
										<div className="relative">
											<MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="businessAddress"
												type="text"
												placeholder="Enter your business address"
												value={formData.businessAddress}
												onChange={(e) =>
													updateFormData("businessAddress", e.target.value)
												}
												className="pl-10"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="sellerPassword">Password</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="sellerPassword"
												type={showPassword ? "text" : "password"}
												placeholder="Create a password"
												value={formData.password}
												onChange={(e) =>
													updateFormData("password", e.target.value)
												}
												className="pl-10 pr-10"
												required
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
												onClick={() => setShowPassword(!showPassword)}>
												{showPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="sellerConfirmPassword">
											Confirm Password
										</Label>
										<div className="relative">
											<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="sellerConfirmPassword"
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Confirm your password"
												value={formData.confirmPassword}
												onChange={(e) =>
													updateFormData("confirmPassword", e.target.value)
												}
												className="pl-10 pr-10"
												required
											/>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
												onClick={() =>
													setShowConfirmPassword(!showConfirmPassword)
												}>
												{showConfirmPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>
										</div>
									</div>

									<Button
										type="submit"
										className="w-full btn-hero"
										disabled={loading}>
										{loading ? "Creating..." : "Create Seller Account"}
									</Button>
								</form>
							</TabsContent>
						</Tabs>
						{error && <p className="text-red-500 text-center mt-4">{error}</p>}
						<p className="text-center text-sm text-muted-foreground mt-6">
							Already have an account?{" "}
							<Link
								to="/login"
								className="text-primary hover:underline font-medium">
								Sign in
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default RegisterPage;
