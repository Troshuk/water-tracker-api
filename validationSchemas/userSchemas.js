import Joi from 'joi';
import { passwordRegex } from '../constants/userConstants.js';

const emailOptions = { minDomainSegments: 2, tlds: { allow: ['com', 'net'] } };

const user = {
  email: Joi.string().email(emailOptions),
  password: Joi.string().regex(passwordRegex),
};

export const createUserSchema = Joi.object({
  email: user.email.required(),
  password: user.password.required(),
});

export const authenticateUserSchema = Joi.object({
  email: user.email.required(),
  password: user.password.required(),
});

export const updateUserSchema = Joi.object(user);

export const requireEmailSchema = Joi.object({
  email: user.email.required(),
});

export const updatePasswordSchema = Joi.object({
  password: user.password.required(),
});
