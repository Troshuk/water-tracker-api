import Joi from 'joi';
import moment from 'moment-timezone';

import {
  dailyWaterGoalOptions,
  genderOptions,
  passwordRegex,
} from '../constants/userConstants.js';

const isValidTimezone = (value, helpers) => {
  if (!moment.tz.names().includes(value)) {
    return helpers.error('any.invalid');
  }

  return value;
};

const emailOptions = { minDomainSegments: 2, tlds: { allow: ['com', 'net'] } };

const user = {
  name: Joi.string().max(32),
  email: Joi.string().email(emailOptions).messages({
    'string.email':
      'The {{#label}} field format is invalid. At least 2 domain segments required. Only these TLDS allowed: com, net',
  }),
  password: Joi.string().min(8).max(64).regex(passwordRegex).messages({
    'string.pattern.base':
      'The {{#label}} can only contain lower/uppser case letters and numbers',
  }),
  gender: Joi.string().valid(...Object.values(genderOptions)),
  dailyWaterGoal: Joi.number()
    .min(dailyWaterGoalOptions.MIN)
    .max(dailyWaterGoalOptions.MAX)
    .label('daily water goal'),
  timezone: Joi.string().custom(isValidTimezone, 'Custom Validation').messages({
    'any.invalid':
      'The {{#label}} shoud be a valid timezone string. Example: `America/New_York`',
  }),
};

export const createUserSchema = Joi.object({
  ...user,
  email: user.email.required(),
  password: user.password.required(),
  timezone: user.timezone.required(),
});

export const authenticateUserSchema = Joi.object({
  email: user.email.required(),
  password: user.password.required(),
  timezone: user.timezone.required(),
});

export const updateUserSchema = Joi.object({
  ...user,
  old_password: user.password
    .when('password', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .label('old password'),
})
  .min(1)
  .message('At least one field must be provided');

export const requireEmailSchema = Joi.object({
  email: user.email.required(),
});

export const updatePasswordSchema = Joi.object({
  password: user.password.required(),
});

export const waterDailySchema = Joi.object({
  dailyWaterGoal: user.dailyWaterGoal.required(),
  viewingDate: Joi.date().iso(),
});
