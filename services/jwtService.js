import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import serverConfigs from '../configs/serverConfigs.js';
import HttpError from '../helpers/HttpError.js';

const { JWT_SECRET, JWT_EXPIRE } = serverConfigs.JWT;

const signToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

const checkToken = (token) => {
  if (!token) throw new HttpError(StatusCodes.UNAUTHORIZED, 'Not authorized');

  try {
    const { id } = jwt.verify(token, JWT_SECRET);

    return id;
  } catch ({ message, code = StatusCodes.UNAUTHORIZED }) {
    throw new HttpError(code, message);
  }
};

export default {
  signToken,
  checkToken,
};
