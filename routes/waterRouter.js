import express from 'express';
import { validateBody, validateId } from '../middlewares/validateRequest.js';
import {
  createWaterConsumptionSchema,
  updateWaterConsumptionSchema,
} from '../validationSchemas/waterConsumptionSchemas.js';
import {
  addWater,
  deleteWaterById,
  getAllConsumedWater,
  getWaterById,
  updateConsumedWaterById,
} from '../controllers/waterConsumptionController.js';

const waterRouter = express.Router();

waterRouter.post(
  '/consumption',
  validateBody(createWaterConsumptionSchema),
  addWater
);
waterRouter.get('/consumption', getAllConsumedWater);
waterRouter.get('/consumption/:id', validateId, getWaterById);
waterRouter.delete('/consumption/:id', validateId, deleteWaterById);
waterRouter.patch(
  '/consumption/:id',
  validateId,
  validateBody(updateWaterConsumptionSchema),
  updateConsumedWaterById
);

export default waterRouter;
