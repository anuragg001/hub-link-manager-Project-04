import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import env from './src/config/env.js';
import errorHandler from './src/middleware/errorHandler.js';
import logger from './src/utils/logger.js';

import authRoutes from './src/routes/authRoutes.js';
import linkRoutes from './src/routes/linkRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';
import bioRoutes from './src/routes/bioRoutes.js';
import redirectRoutes from './src/routes/redirectRoutes.js';

const app = express();

connectDB();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.set('trust proxy', 1);

app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/bio', bioRoutes);
app.use('/r', redirectRoutes);

app.use(errorHandler);

const PORT = env.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});