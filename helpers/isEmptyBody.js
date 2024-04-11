import HttpError from './HttpError.js';

const isEmptyBody = (req, res, next) => {
  const keys = Object.keys(req.body);
  if (!keys.length) {
    next(HttpError(400, 'Missing fields'));
  }
  next();
};

export default isEmptyBody;
