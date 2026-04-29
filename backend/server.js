const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

const morgan = require('morgan');

const path = require('path');

// Load env vars - using absolute path to ensure it works from root
dotenv.config({ path: path.resolve(__dirname, '.env') });

if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET is not defined. Authentication will fail.');
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

const PORT = process.env.PORT || 5001;

async function startServer() {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri.includes('memory')) {
        console.log("Starting in DEMO MODE (Temporary Database)");
        const mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
    } else {
        console.log("Starting in PERMANENT MODE (Cloud Database)");
    }

    try {
        console.log("Connecting to Database...");
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected Successfully');
        
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (err) {
        console.error('DATABASE CONNECTION ERROR:', err.message);
        process.exit(1);
    }
}

startServer();
