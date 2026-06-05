/**
 * Authentication Middleware
 * Identifies the current user from the Authorization header.
 * Supports fallback to 'guest' for unauthenticated/guest carts.
 */
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = { id: 'guest', role: 'guest' };
      return next();
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      req.user = { id: 'guest', role: 'guest' };
      return next();
    }

    // Since the backend uses mock authentication, we'll map the mock token
    // to the default mock user John Doe, or decode/fallback gracefully.
    const mockToken = 'mock_jwt_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IiIsInJvbGUiOiJjdXN0b21lciJ9';
    
    if (token === mockToken || token.startsWith('mock_jwt_token_')) {
      req.user = {
        id: 'usr_982374823', // Hardcoded default mock user ID (from authController.js)
        name: 'John Doe',
        email: 'user@example.com',
        role: 'customer'
      };
    } else {
      // In case they pass a different mock/custom user ID token
      req.user = {
        id: 'usr_custom_user',
        role: 'customer'
      };
    }

    next();
  } catch (error) {
    next(error);
  }
};
