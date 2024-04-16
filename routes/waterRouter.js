import express from 'express';
import { validateBody, validateId, validateParams } from '../middlewares/validateRequest.js';
import { createWaterConsumptionSchema, waterConsumptionParamsDayRange } from "../validationSchemas/waterConsumptionSchemas.js"
import { addWater, getWaterById, getWaterMonth, getWaterToday } from '../controllers/waterConsumptionController.js';

const waterRouter = express.Router();

waterRouter.post('/consumption', validateBody(createWaterConsumptionSchema), addWater);
waterRouter.get('/consumption/:id', validateId, getWaterById);
waterRouter.get('/today', getWaterToday);
waterRouter.get('/stats-by-date-range/:startDate/:endDate', validateParams(waterConsumptionParamsDayRange), getWaterMonth);

export default waterRouter;
