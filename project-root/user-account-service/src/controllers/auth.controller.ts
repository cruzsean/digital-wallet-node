import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import validator from '../utils/validator';
import logger from '../utils/logger';

interface UserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { error } = validator.validateUser(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password, firstName, lastName }: UserPayload = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });

    user = new User({ email, password, firstName, lastName });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    res.status(201).json({ token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch (error) {
    logger.error('Error in user registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { error } = validator.validateLogin(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await user.checkPassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch (error) {
    logger.error('Error in user login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
