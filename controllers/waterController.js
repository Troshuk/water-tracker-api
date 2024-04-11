import HttpError from '../helpers/HttpError.js';
import ctrlWrapper from '../helpers/ctrlWrapper.js';
import BaseSchema from '../models/BaseSchema.js';

const rateDaily = async (req, res, next) => {
  const { dailyNorma } = req.body;
  const { _id } = req.user;
  const result = await BaseSchema.findByIdAndUpdate(
    _id,
    { dailyNorma },
    { returnDocument: 'after' }
  );
  if (!result) {
    return next(HttpError(404, 'Not found'));
  }
  res.json({
    dailyNorma: result.dailyNorma,
  });
};

export default {
  rateDaily: ctrlWrapper(rateDaily),
};
