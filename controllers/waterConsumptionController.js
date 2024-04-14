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

  const consumptionPercentage = Math.round(
    (totalDailyWaterConsumption / dailyWaterGoal) * 100);

  res.json({
    consumptionPersentage: consumptionPercentage,
    consumption: waterEntries.map(transformWaterConsumption),
  });
});

export const getWaterMonth = catchErrors(async (req, res) => {
  const { dailyWaterGoal } = req.user;
  const { _id: owner } = req.user;

  const waterEntries = await waterService.getWaterForUserByMonth(owner);

  const entriesCount = {};

  waterEntries.forEach((entry) => {
    const dateKey = entry.consumed_at.toISOString().split('T')[0];
    entriesCount[dateKey] = entriesCount[dateKey] ? entriesCount[dateKey] + 1 : 1;});

  const data = waterEntries.map((entry) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    const month = monthNames[entry.consumed_at.getMonth()];
    const day = entry.consumed_at.getDate();

    const dateKey = entry.consumed_at.toISOString().split('T')[0];
    const entriesCountForDate = entriesCount[dateKey] || 0;

    return {
      date: `${day}, ${month}`,
      dailyWaterGoal: `${(dailyWaterGoal / 1000).toFixed(1)} L`,
      consumptionPercentage: `${Math.round((entry.value / dailyWaterGoal) * 100)}`,
      entriesCount: entriesCountForDate,
    };
  });
  res.json(data);
});
