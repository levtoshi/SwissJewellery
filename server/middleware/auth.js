import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';

// Middleware for auth check
export const protect = async (req, res, next) => {
  try {
    // Getting token from headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token is not provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Getting user
    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Adding user to req
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authorization error' });
  }
};

// Middleware from Admin role check
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Only for administrators' });
  }
};

// Middleware for optional auth (for guests and users)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);

      if (decoded) {
        const user = await User.findById(decoded.id).select('-password -refreshToken');
        if (user) {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};