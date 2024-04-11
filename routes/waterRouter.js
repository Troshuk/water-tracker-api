import express from 'express';
import waterController from '../controllers/waterController.js';
import { validateBody } from '../middlewares/validateRequest.js';
import isEmptyBody from '../helpers/isEmptyBody.js';
import waterDailySchema from '../waterSchemas/dailySchema.js';

const waterRoute = express.Router();

waterRoute.patch(
  '/rate',
  isEmptyBody,
  validateBody(waterDailySchema),
  waterController.rateDaily
);

export default waterRoute;
