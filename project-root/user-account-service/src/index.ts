import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
// Importing routes (if you have defined any specific routes for user and account services)
import userRoutes from './routes/auth.routes'; // Assuming you have these routes set up
// import accountRoutes from './routes/account.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Sample route
app.get('/', (req, res) => {
    res.send('User Service is running!');
});

app.use('/auth', userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});
