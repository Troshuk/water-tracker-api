import { StatusCodes } from 'http-status-codes';
import HttpError from '../helpers/HttpError.js';

import catchErrors from '../decorators/catchErrors.js';
import waterService from '../services/modelServices/WaterConsumptionService.js';

export const addWater = catchErrors(async (req, res) => {
  await waterService.addWater({ ...req.body, owner: req.user._id });
  res.json({ message: 'Water added' });
});

export const getWaterById = catchErrors(async (req, res) => {
  const { id } = req.params;
  const result = await waterService.getWaterById({ _id: id, owner: req.user._id });
  if (!result) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Id not found')
  }
  res.status(200).json(result)
});