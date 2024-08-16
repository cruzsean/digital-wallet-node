"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Importing routes (if you have defined any specific routes for user and account services)
const auth_routes_1 = __importDefault(require("./routes/auth.routes")); // Assuming you have these routes set up
// import accountRoutes from './routes/account.routes';
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));
// Sample route
app.get('/', (req, res) => {
    res.send('User Service is running!');
});
app.use('/auth', auth_routes_1.default);
// Start the server
app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});
