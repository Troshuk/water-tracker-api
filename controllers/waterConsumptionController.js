import { StatusCodes } from 'http-status-codes';
import moment from 'moment-timezone';

import HttpError from '../helpers/HttpError.js';
import {
  transformWaterConsumption,
  transformWaterConsumptionStatisticsByDateRange,
} from '../transformers/waterConsumptionTransformer.js';

import catchErrors from '../decorators/catchErrors.js';
import waterService from '../services/modelServices/WaterConsumptionService.js';

export const addWater = catchErrors(async (req, res) => {
  const { id, dailyWaterGoal, timezone: timeZone } = req.user;
  const { consumed_at } = req.body;

  const today = new Date(moment().tz(timeZone));
  const consumedAt = new Date(moment(consumed_at).tz(timeZone).toISOString());

  // If passed day is before today, check if any records for this day already exist
  if (consumedAt < today) {
    const usersDate = moment(consumed_at).tz(timeZone);
    const startDate = new Date(usersDate.startOf('day').toISOString());
    const endDate = new Date(usersDate.endOf('day').toISOString());

    const consumption = await waterService.getFirstWaterForUserForDateRange(
      id,
      startDate,
      endDate
    );

    // If we found one record, take it's dailyWaterGoal and use it for this record
    if (consumption) {
      req.body.dailyWaterGoal = consumption.dailyWaterGoal;
    }
  }

  const addedWater = await waterService.addWaterForUser(id, {
    dailyWaterGoal,
    ...req.body,
  });

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
  const { dailyWaterGoal, timezone: timeZone, _id: owner } = req.user;

  const usersDate = moment().tz(timeZone);

  const startDate = new Date(usersDate.startOf('day').toISOString());
  const endDate = new Date(usersDate.endOf('day').toISOString());

  const water = await waterService.getWaterForUserByDateRange(
    owner,
    startDate,
    endDate
  );

  const totalConsumed = water.reduce((acc, entry) => acc + entry.value, 0);

  res.json({
    consumptionPercentage:
      totalConsumed <= dailyWaterGoal
        ? Math.round((totalConsumed / dailyWaterGoal) * 100)
        : 100,
    consumption: water.map(transformWaterConsumption),
  });
});

export const getWaterForDay = catchErrors(async (req, res) => {
  const { dailyWaterGoal, timezone: timeZone, _id: owner } = req.user;
  const { date } = req.params;

  const usersDate = moment(date).tz(timeZone);

  const startDate = new Date(usersDate.startOf('day').toISOString());
  const endDate = new Date(usersDate.endOf('day').toISOString());

  const water = await waterService.getWaterForUserByDateRange(
    owner,
    startDate,
    endDate
  );

  const totalConsumed = water.reduce((acc, entry) => acc + entry.value, 0);

  const waterGoal = water?.[0]?.dailyWaterGoal ?? dailyWaterGoal;

  res.json({
    consumptionPercentage:
      totalConsumed <= waterGoal
        ? Math.round((totalConsumed / waterGoal) * 100)
        : 100,
    consumption: water.map(transformWaterConsumption),
    dailyWaterGoal: waterGoal,
  });
});

export const getWaterByDateRange = catchErrors(async (req, res) => {
  const { timezone } = req.user;
  const { startDate, endDate } = req.params;
  const { _id: owner } = req.user;

  const waterEntries = await waterService.getStatisticsByDateRange(
    owner,
    new Date(startDate),
    new Date(endDate),
    timezone
  );

  res.json(waterEntries.map(transformWaterConsumptionStatisticsByDateRange));
});
