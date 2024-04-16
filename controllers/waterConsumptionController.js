import { StatusCodes } from 'http-status-codes';
import HttpError from '../helpers/HttpError.js';
import {
  transformWaterConsumption,
  transformWaterConsumptionStatisticsByDateRange,
} from '../transformers/waterConsumptionTransformer.js';

import catchErrors from '../decorators/catchErrors.js';
import waterService from '../services/modelServices/WaterConsumptionService.js';

export const addWater = catchErrors(async (req, res) => {
  const addedWater = await waterService.addWaterForUser(req.user._id, req.body);

  res.status(StatusCodes.CREATED).json(transformWaterConsumption(addedWater));
});

export const getWaterById = catchErrors(async (req, res) => {
  const { id } = req.params;

  const consumedWater = await waterService.getWaterForUserById(
    req.user._id,
    id
  );

  if (!consumedWater) {
    throw new HttpError(
      StatusCodes.NOT_FOUND,
      'Water with current Id not found'
    );
  }

  res.json(transformWaterConsumption(consumedWater));
});

export const deleteConsumedWaterById = catchErrors(async (req, res) => {
  const { id } = req.params;

  const consumedWater = await waterService.deleteWaterForUserById(
    req.user._id,
    id
  );

  if (!consumedWater) {
    throw new HttpError(
      StatusCodes.NOT_FOUND,
      'Water with current Id not found'
    );
  }

  res.json(transformWaterConsumption(consumedWater));
});

export const updateConsumedWaterById = catchErrors(async (req, res) => {
  const { id } = req.params;

  const consumedWater = await waterService.updateWaterForUserById(
    req.user.id,
    id,
    req.body
  );

  if (!consumedWater) {
    throw new HttpError(
      StatusCodes.NOT_FOUND,
      'Water with current Id not found'
    );
  }
  res.json(transformWaterConsumption(consumedWater));
});

export const getAllConsumedWater = catchErrors(async (req, res) => {
  const consumedWaterList = await waterService.getAllWater(req.user.id);

  res.json(consumedWaterList.map(transformWaterConsumption));
});

export const getWaterToday = catchErrors(async (req, res) => {
  const { dailyWaterGoal } = req.user;
  const { _id: owner } = req.user;

  const waterEntries = await waterService.getWaterForUserForToday(owner);

  const totalDailyWaterConsumption = waterEntries.reduce(
    (acc, entry) => acc + entry.value,
    0
  );

  const consumptionPercentage = Math.round(
    (totalDailyWaterConsumption / dailyWaterGoal) * 100
  );

  res.json({
    consumptionPersentage: consumptionPercentage,
    consumption: waterEntries.map(transformWaterConsumption),
  });
});

export const getWaterMonth = catchErrors(async (req, res) => {
  const { dailyWaterGoal } = req.user;
  const { _id: owner } = req.user;

  const startDate = new Date(req.params.startDate);

  const endDate = new Date(req.params.endDate);
  endDate.setHours(23, 59, 59, 999);

  const waterEntries =
    await waterService.getWaterConsumptionStatisticsByDateRange(
      owner,
      dailyWaterGoal,
      startDate,
      endDate
    );

  res.json(waterEntries.map(transformWaterConsumptionStatisticsByDateRange));
});
