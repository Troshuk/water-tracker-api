import express from 'express';
import { validateBody, validateId } from '../middlewares/validateRequest.js';
import { createWaterConsumptionSchema } from "../validationSchemas/waterConsumptionSchemas.js"
import { addWater, getWaterById, getWaterMonth, getWaterToday } from '../controllers/waterConsumptionController.js';

const waterRouter = express.Router();

waterRouter.post('/consumption', validateBody(createWaterConsumptionSchema), addWater);
waterRouter.get('/consumption/:id', validateId, getWaterById);
waterRouter.get('/today', getWaterToday);
waterRouter.get('/month', getWaterMonth);

export default waterRouter;
