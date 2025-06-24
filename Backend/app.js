import express from 'express';
import adminRouter from './router/admin.router.js';
import assetrouter from './router/asset.router.js';
import userRouter from './router/user.router.js';
import authrouter from './router/auth.router.js';
import importRouter from './router/import.router.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();


app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());// enable cookie parsing

// Routes
app.use('/api/admin', adminRouter);
app.use('/api/assets', assetrouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authrouter);
app.use('/api/upload', importRouter);
// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
import {handleError} from './middleware/handleError.js';
app.use(handleError)


export default app;
