import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config.js';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './swagger.json' assert { type: 'json' };

import usersRouter from './routes/userRouter.js';
import validateAuth from './middlewares/validateAuth.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import { envTypes } from './constants/configConstants.js';
import serverConfigs from './configs/serverConfigs.js';

const app = express();

const { ENV, PORT } = serverConfigs.APP;
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = serverConfigs.DB;

if (ENV === envTypes.DEVELOPMENT) app.use(morgan('dev'));

app.use(cors());
app.use(express.json());

// Unauthenticated routes:
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/api/users', usersRouter);

// Apply auth middleware
app.use('/api', validateAuth);

// Authenticated routes:

app.use((_, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'Route not found' });
});

app.use(globalErrorHandler);

try {
  await mongoose.connect(DB_HOST, {
    dbName: DB_NAME,
    user: DB_USER,
    pass: DB_PASSWORD,
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Database connection successful on port ${PORT}`);
  });
} catch ({ message }) {
  // eslint-disable-next-line no-console
  console.error(`Server not running. Error message: ${message}`);
  process.exit(1);
}

export default app;
