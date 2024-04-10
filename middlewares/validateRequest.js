import { isValidObjectId } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

import HttpError from '../helpers/HttpError.js';
import catchErrors from '../decorators/catchErrors.js';

export const validateBody = (schema) =>
  catchErrors(({ body }, _, next) => {
    const { error } = schema.validate(body);

    if (error) {
      throw new HttpError(StatusCodes.BAD_REQUEST, error.message, error);
    }

    next();
  });

export const validateQuery = (schema) =>
  catchErrors(({ query }, _, next) => {
    const { error } = schema.validate(query);

    if (error) {
      throw new HttpError(StatusCodes.BAD_REQUEST, error.message, error);
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
