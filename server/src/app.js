/** @format */

// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
const { errorHandler } = require("./middlewares/error.middleware");
const config = require("./config/env");

const app = express();

// ---------------------------
// Security Middlewares
// ---------------------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ---------------------------
// CORS Configuration
// ---------------------------
app.use(
  cors({
    origin: config.corsOrigin || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// ---------------------------
// Logging Middleware
// ---------------------------
if (config.nodeEnv !== "test") {
  app.use(morgan(config.nodeEnv === "development" ? "dev" : "combined"));
}

// ---------------------------
// Body Parsing Middleware
// ---------------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ---------------------------
// Root Route - Health Check
// ---------------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: `🚀 ${config.appName} API is running successfully`,
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: "1.0.0",
  });
});

// ---------------------------
// API Documentation Route
// ---------------------------
app.get("/api/docs", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Documentation",
    endpoints: {
      auth: {
        customerRegister: "POST /api/auth/register/customer",
        sellerRegister: "POST /api/auth/register/seller",
        login: "POST /api/auth/login",
      },
      health: "GET /api/health",
    },
  });
});

// ---------------------------
// API Routes - FIXED: Add validation for apiPrefix
// ---------------------------
const apiPrefix = config.apiPrefix || '/api';
console.log(`🔄 Registering routes with prefix: ${apiPrefix}`);
app.use(apiPrefix, routes);

// ---------------------------
// 404 Handler for Undefined Routes
// ---------------------------
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "🔍 Route not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------
// Global Error Handling Middleware
// ---------------------------
app.use(errorHandler);

module.exports = app;