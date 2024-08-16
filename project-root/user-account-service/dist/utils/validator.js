"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validator = {
    validateUser(user) {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(8).required(),
            firstName: joi_1.default.string().min(2).max(50).required(),
            lastName: joi_1.default.string().min(2).max(50).required()
        });
        return schema.validate(user);
    },
    validateLogin(data) {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().required()
        });
        return schema.validate(data);
    },
    // other validation methods remain unchanged
};
exports.default = validator;
