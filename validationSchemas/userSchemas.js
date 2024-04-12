import Joi from 'joi';
import { genderOptions, passwordRegex, waterOptions } from '../constants/userConstants.js';

const emailOptions = { minDomainSegments: 2, tlds: { allow: ['com', 'net'] } };

const user = {
  name: Joi.string(),
  email: Joi.string().email(emailOptions),
  password: Joi.string().regex(passwordRegex),
  gender: Joi.string().valid(...Object.values(genderOptions)),
  dailyWaterGoal: Joi.number().valid(...Object.values(waterOptions))
};

export const createUserSchema = Joi.object({
  ...user,
  email: user.email.required(),
  password: user.password.required(),
  gender: user.gender.required(),
});

export const authenticateUserSchema = Joi.object({
  email: user.email.required(),
  password: user.password.required(),
});

export const updateUserSchema = Joi.object({
  ...user,
  old_password: user.password.when('password', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
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
  dailyWaterGoal: user.dailyWaterGoal.required()
})
  .min(1)
  .message('At least one field must be provided');
