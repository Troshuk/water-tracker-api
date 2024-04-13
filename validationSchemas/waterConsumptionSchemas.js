import Joi from "joi";

export const createWaterConsumptionSchema = Joi.object({
    value: Joi.number().required(),
    consumed_at: Joi.date().required(),
})
