import Joi from 'joi';

import { waterConsumptionOptions } from '../constants/userConstants.js';

const waterConsumption = {
  value: Joi.number()
    .min(waterConsumptionOptions.MIN)
    .max(waterConsumptionOptions.MAX),
  consumed_at: Joi.date().iso(),
};

export const createWaterConsumptionSchema = Joi.object({
  ...waterConsumption,
  value: waterConsumption.value.required(),
  consumed_at: waterConsumption.consumed_at.required(),
});

export const waterConsumptionParamsDayRange = Joi.object({
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
});

export const updateWaterConsumptionSchema = Joi.object({
  ...waterConsumption,
})
  .min(1)
  .message('At least one field must be provided');
