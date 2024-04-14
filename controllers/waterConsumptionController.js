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
  const receivedWaterById = await waterService.getWaterForUserById(req.user._id, id);
  if (!receivedWaterById) {
    throw new HttpError(
      StatusCodes.NOT_FOUND,
      'Water with current Id not found'
    );
  }
  res.json(transformWaterConsumption(receivedWaterById));
});

export const getWaterToday = catchErrors(async (req, res) => {
  const { dailyWaterGoal } = req.user;
  const { _id: owner } = req.user;

  const waterEntries = await waterService.getWaterForUserForToday(owner);

  const totalDailyWaterConsumption = waterEntries.reduce((acc, entry) => acc + entry.value, 0);

  const consumptionPercentage = Math.round((totalDailyWaterConsumption / dailyWaterGoal) * 100);

  res.json({
    consumptionPersentage: consumptionPercentage,
    consumption: waterEntries.map(transformWaterConsumption),
  });
});
