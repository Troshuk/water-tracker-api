import { StatusCodes } from 'http-status-codes';
import HttpError from '../helpers/HttpError.js';
import { transformWaterConsumption } from '../transformers/waterConsumptionTransformer.js';

import catchErrors from '../decorators/catchErrors.js';
import waterService from '../services/modelServices/WaterConsumptionService.js';

export const addWater = catchErrors(async (req, res) => {
  const result = await waterService.addWaterForUser({ owner: req.user._id, ...req.body });
  res.status(201).json(transformWaterConsumption(result));
})

export const getWaterById = catchErrors(async (req, res) => {
  const { id } = req.params;
  const result = await waterService.getWaterForUserById({ owner: req.user._id, _id: id });
  if (!result) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Id not found')
  }
  res.status(200).json(transformWaterConsumption(result))
});