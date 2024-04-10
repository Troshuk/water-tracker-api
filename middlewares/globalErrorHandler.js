import { getReasonPhrase, StatusCodes } from 'http-status-codes';

import { envTypes } from '../constants/configConstants.js';
import serverConfigs from '../configs/serverConfigs.js';

// eslint-disable-next-line no-unused-vars
export default (req, _, res, __) => {
  const {
    status = StatusCodes.INTERNAL_SERVER_ERROR,
    message = getReasonPhrase(status),
    data,
    stack,
  } = req;
  const response = { message };

  if (serverConfigs.APP.ENV !== envTypes.PRODUCTION) {
    response.data = data;
    response.stack = stack;
  } else if (status === StatusCodes.INTERNAL_SERVER_ERROR) {
    response.message = getReasonPhrase(status);
  }

  res.status(status).json(response);
};
