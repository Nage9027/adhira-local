/** @format */

/**
 * Success Response Helper
 * Standardized success response format for all API endpoints
 */
const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message: message,
    statusCode: statusCode,
    timestamp: new Date().toISOString(),
  };

  // Only include data if provided
  if (data !== null && data !== undefined) {
    response.data = data;
  }

  console.log(`✅ Success: ${statusCode} - ${message}`);
  return res.status(statusCode).json(response);
};

/**
 * Error Response Helper
 * Standardized error response format for all API endpoints
 */
const errorResponse = (res, message, statusCode = 500, errorDetails = null) => {
  const response = {
    success: false,
    message: message,
    statusCode: statusCode,
    timestamp: new Date().toISOString(),
  };

  // Include error details in development mode or for client errors (4xx)
  if (errorDetails && (process.env.NODE_ENV === 'development' || statusCode < 500)) {
    response.details = errorDetails;
  }

  // Log errors appropriately
  if (statusCode >= 500) {
    console.error(`❌ Server Error ${statusCode}:`, {
      message: message,
      error: errorDetails,
      path: res.req?.originalUrl,
      method: res.req?.method,
    });
  } else {
    console.warn(`⚠️ Client Error ${statusCode}:`, message);
  }

  return res.status(statusCode).json(response);
};

/**
 * Validation Error Response
 * Specialized response for validation errors
 */
const validationErrorResponse = (res, errors) => {
  const errorDetails = Array.isArray(errors) 
    ? errors 
    : errors.array 
      ? errors.array() 
      : [errors];

  return errorResponse(
    res,
    'Validation failed. Please check your input data.',
    422, // Unprocessable Entity
    errorDetails.map(error => ({
      field: error.path || error.param || 'unknown',
      message: error.msg || error.message || 'Invalid value',
      value: error.value
    }))
  );
};

/**
 * Not Found Response
 * For 404 errors when resources are not found
 */
const notFoundResponse = (res, resource = 'Resource') => {
  return errorResponse(
    res,
    `${resource} not found`,
    404
  );
};

/**
 * Unauthorized Response
 * For 401 errors when authentication fails
 */
const unauthorizedResponse = (res, message = 'Authentication required') => {
  return errorResponse(
    res,
    message,
    401
  );
};

/**
 * Forbidden Response
 * For 403 errors when user doesn't have permission
 */
const forbiddenResponse = (res, message = 'Access forbidden') => {
  return errorResponse(
    res,
    message,
    403
  );
};

/**
 * Conflict Response
 * For 409 errors when there's a resource conflict
 */
const conflictResponse = (res, message = 'Resource already exists') => {
  return errorResponse(
    res,
    message,
    409
  );
};

/**
 * Too Many Requests Response
 * For 429 rate limiting errors
 */
const tooManyRequestsResponse = (res, message = 'Too many requests') => {
  return errorResponse(
    res,
    message,
    429
  );
};

/**
 * Service Unavailable Response
 * For 503 errors when service is temporarily unavailable
 */
const serviceUnavailableResponse = (res, message = 'Service temporarily unavailable') => {
  return errorResponse(
    res,
    message,
    503
  );
};

/**
 * Bad Request Response
 * For 400 errors when client sends invalid request
 */
const badRequestResponse = (res, message = 'Bad request') => {
  return errorResponse(
    res,
    message,
    400
  );
};

/**
 * Created Response
 * For 201 responses when resource is successfully created
 */
const createdResponse = (res, message, data = null) => {
  return successResponse(res, message, data, 201);
};

/**
 * No Content Response
 * For 204 responses when operation succeeds but no content to return
 */
const noContentResponse = (res) => {
  return res.status(204).end();
};

/**
 * Paginated Response
 * For responses that include pagination data
 */
const paginatedResponse = (res, message, data, pagination) => {
  const response = {
    success: true,
    message: message,
    statusCode: 200,
    timestamp: new Date().toISOString(),
    data: data,
    pagination: pagination
  };

  console.log(`✅ Paginated Success: ${message} (${data.length} items)`);
  return res.status(200).json(response);
};

module.exports = {
  // Success responses
  successResponse,
  createdResponse,
  noContentResponse,
  paginatedResponse,
  
  // Error responses
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  conflictResponse,
  tooManyRequestsResponse,
  serviceUnavailableResponse,
  badRequestResponse,
};