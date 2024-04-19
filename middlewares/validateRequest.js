import { isValidObjectId } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import HttpError from '../helpers/HttpError.js';
import catchErrors from '../decorators/catchErrors.js';

const validationConfigs = {
  abortEarly: true,
  messages: {
    'any.required': 'The {{#label}} field is required',
    'any.only': 'The {{#label}} can only be one of {{#valids}}',
    'string.base': 'The {{#label}} must be a string',
    'string.empty': 'The {{#label}} must not be empty',
    'string.min': 'The {{#label}} must be at least {{#limit}} characters long',
    'string.max': 'The {{#label}} must be at most {{#limit}} characters long',
    'number.min': 'The {{#label}} must be at least {{#limit}}',
    'number.max': 'The {{#label}} must be at most {{#limit}}',
  },
};

export const validateBody = (schema) =>
  catchErrors(({ body }, _, next) => {
    const { error } = schema.validate(body, validationConfigs);

    if (error) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        error.message.replaceAll('"', ''),
        error
      );
    }

    next();
  });

export const validateParams = (schema) =>
  catchErrors(({ params }, _, next) => {
    const { error } = schema.validate(params);

    if (error) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        error.message.replaceAll('"', ''),
        error
      );
    }

    next();
  });

export const validateId = catchErrors(({ params: { id } }, _, next) => {
  if (!isValidObjectId(id)) {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `This is not a valid resource ID: ${id}`
    );
  }

  next();
});

export const validateFile = (fieldName) =>
  catchErrors(({ file }, _, next) => {
    if (!file) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `File is required for this request through field [${fieldName}]`
      );
    }

    next();
  });
