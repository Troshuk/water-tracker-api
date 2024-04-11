import Joi from 'joi';

const waterDailySchema = Joi.object({
  dailyNorma: Joi.number().min(0).max(15000).required()
    .messages({
      'number.max': 'Maximal value is 15000',
      'number.min': 'Minimal value is 0',
    }),
});

export default waterDailySchema;
