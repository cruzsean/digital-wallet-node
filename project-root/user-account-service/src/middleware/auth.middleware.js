"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const logger_1 = __importDefault(require("../utils/logger"));
const authenticateJWT = async (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_model_1.default.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid token. User not found.' });
        }
        // Attach the user to the request object
        req.user = user;
        next();
    }
    catch (error) {
        logger_1.default.error('Authentication error:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token.' });
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired.' });
        }
        res.status(500).json({ error: 'Internal server error.' });
    }
};
exports.default = authenticateJWT;
