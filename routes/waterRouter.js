import express from 'express';
import { validateBody, validateId } from '../middlewares/validateRequest.js';
import {
  createWaterConsumptionSchema,
  updateWaterConsumptionSchema,
} from '../validationSchemas/waterConsumptionSchemas.js';
import {
  addWater,
  deleteConsumedWaterById,
  getAllConsumedWater,
  getWaterById,
  getWaterToday,
  updateConsumedWaterById,
} from '../controllers/waterConsumptionController.js';

const waterRouter = express.Router();

waterRouter
  .route('/consumption')
  .post(validateBody(createWaterConsumptionSchema), addWater)
  .get(getAllConsumedWater);

waterRouter
  .route('/consumption/:id')
  .all(validateId)
  .get(getWaterById)
  .delete(deleteConsumedWaterById)
  .patch(validateBody(updateWaterConsumptionSchema), updateConsumedWaterById);

waterRouter.get('/today', getWaterToday);

export default waterRouter;
