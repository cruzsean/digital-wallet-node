import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import logger from '../utils/logger';

// Extend Request interface to include 'user' property
interface AuthenticatedRequest extends Request {
    user?: any; // Replace 'any' with your specific user type if available
}

const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Invalid token format.' });
    }

    // Verify token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired.' });
    }

    res.status(500).json({ error: 'Internal server error.' });
  }
};

export default authenticateJWT;
