import Joi from 'joi';

const waterConsumption = {
  value: Joi.number().min(0).max(5000),
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
