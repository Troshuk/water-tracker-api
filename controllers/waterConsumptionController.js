import { StatusCodes } from 'http-status-codes';
import HttpError from '../helpers/HttpError.js';
import { transformWaterConsumption } from '../transformers/waterConsumptionTransformer.js';

import catchErrors from '../decorators/catchErrors.js';
import waterService from '../services/modelServices/WaterConsumptionService.js';

export const addWater = catchErrors(async (req, res) => {
  const addedWater = await waterService.addWaterForUser(req.user._id, req.body);
  res.status(StatusCodes.CREATED).json(transformWaterConsumption(addedWater));
});

export const getWaterById = catchErrors(async (req, res) => {
  const { id } = req.params;
  const receivedWaterById = await waterService.getWaterForUserById(
    req.user._id,
    id
  );
  if (!receivedWaterById) {
    throw new HttpError(
      StatusCodes.NOT_FOUND,
      'Water with current Id not found'
    );
  }
  res.json(transformWaterConsumption(receivedWaterById));
});
export const deleteConsumedWaterById = catchErrors(async (req, res) => {
  const { id } = req.params;
  const deleteConsumeddWaterById = await waterService.deleteWaterForUserById(
    req.user._id,
    id
  );
  if (!deleteConsumeddWaterById) {
    throw new HttpError(
      StatusCodes.NOT_FOUND,
      'Water with current Id not found'
    );
  }
  res.json(transformWaterConsumption(deleteConsumeddWaterById));
});

export const updateConsumedWaterById = catchErrors(async (req, res) => {
  const { id } = req.params;
  const updatedConsumedWater = await waterService.updateWaterForUserById(
    req.user.id,
    id,
    req.body
  );
  if (!updatedConsumedWater) {
    throw new HttpError(
      StatusCodes.NOT_FOUND,
      'Water with current Id not found'
    );
  }
  res.json(transformWaterConsumption(updatedConsumedWater));
});

export const getAllConsumedWater = catchErrors(async (req, res) => {
  const listConsumedWater = await waterService.getAllListConsumedWater(
    req.user.id
  );
  res.json(listConsumedWater);
});
