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
export const deleteWaterById = catchErrors(async (req, res) => {
  const { id } = req.params;
  const deletedWaterById = await waterService.deleteUsersWaterById(
    req.user._id,
    id
  );
  if (!deletedWaterById) {
    throw new HttpError(
      StatusCodes.NOT_FOUND,
      'Water with current Id not found'
    );
  }
  res.json(transformWaterConsumption(deletedWaterById));
});

export const updateConsumedWaterById = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      'Body must have at least one field'
    );
  }
  const { id } = req.params;
  const updatedConsumedWater = await waterService.updateUsersConsumedWaterById(
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
};
