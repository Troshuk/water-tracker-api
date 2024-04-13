import Joi from 'joi';

const waterConsumption = {
  value: Joi.number().min(0).max(5000),
  consumed_at: Joi.date(),
};

export const createWaterConsumptionSchema = Joi.object({
  ...waterConsumption,
  value: waterConsumption.value.required(),
  consumed_at: waterConsumption.consumed_at.required(),
});
