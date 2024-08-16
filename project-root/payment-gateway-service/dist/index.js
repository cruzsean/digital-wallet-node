"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const PORT = 3000;
// Connect to MongoDB
mongoose_1.default.connect('mongodb://mongo:27017/transactions')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));
// Sample route
app.get('/', (req, res) => {
    res.send('Payment Gateway Service is running!');
});
// Start the server
app.listen(PORT, () => {
    console.log(`Transaction service running on port ${PORT}`);
});
