"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const validator_1 = __importDefault(require("../utils/validator"));
const logger_1 = __importDefault(require("../utils/logger"));
const register = async (req, res) => {
    try {
        const { error } = validator_1.default.validateUser(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        const { email, password, firstName, lastName } = req.body;
        let user = await user_model_1.default.findOne({ email });
        if (user)
            return res.status(400).json({ error: 'User already exists' });
        user = new user_model_1.default({ email, password, firstName, lastName });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    }
    catch (error) {
        logger_1.default.error('Error in user registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { error } = validator_1.default.validateLogin(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ error: 'Invalid email or password' });
        const isMatch = await user.checkPassword(password);
        if (!isMatch)
            return res.status(400).json({ error: 'Invalid email or password' });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    }
    catch (error) {
        logger_1.default.error('Error in user login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
