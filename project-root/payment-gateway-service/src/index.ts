import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/transactions')

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
