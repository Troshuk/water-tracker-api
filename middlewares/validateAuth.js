import { StatusCodes } from 'http-status-codes';

import HttpError from '../helpers/HttpError.js';
import usersServices from '../services/modelServices/UserService.js';
import jwtService from '../services/jwtService.js';
import catchErrors from '../decorators/catchErrors.js';

export default catchErrors(async (req, _, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Not authorized');
  }

  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Not authorized');
  }

  const id = jwtService.checkToken(token);
  const user = await usersServices.findById(id);

  if (!user || user.token !== token) {
    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Not authorized');
  }

  req.user = user;

  next();
});
