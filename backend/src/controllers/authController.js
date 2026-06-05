/**
 * Authenticate user and return token
 * @route POST /api/login
 * @access Public
 */
export const login = (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both email and password'
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address'
      });
    }

    // 2. Demo Authentication (To be connected to a database later)
    const mockEmail = 'user@example.com';
    const mockPassword = 'password123';

    if (email === mockEmail && password === mockPassword) {
      const mockUser = {
        id: 'usr_982374823',
        name: 'John Doe',
        email: mockEmail,
        role: 'customer'
      };
      const mockToken = 'mock_jwt_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IiIsInJvbGUiOiJjdXN0b21lciJ9';

      // Return mock user and token
      return res.status(200).json({
        status: 'success',
        message: 'Login successful',
        token: mockToken,
        user: mockUser,
        data: {
          user: mockUser,
          token: mockToken
        }
      });
    }

    // 3. Invalid credentials
    return res.status(401).json({
      status: 'error',
      message: 'Invalid email or password'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Register a new user
 * @route POST /api/register
 * @access Public
 */
export const register = (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide name, email, and password'
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Name must be at least 2 characters long'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters long'
      });
    }

    const mockUser = {
      id: `usr_${Math.floor(100000000 + Math.random() * 900000000)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'customer'
    };
    const mockToken = 'mock_jwt_token_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IiIsInJvbGUiOiJjdXN0b21lciJ9';

    // 2. Demo Registration success
    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token: mockToken,
      user: mockUser,
      data: {
        user: mockUser,
        token: mockToken
      }
    });

  } catch (error) {
    next(error);
  }
};

