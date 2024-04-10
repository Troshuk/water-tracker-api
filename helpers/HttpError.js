import { getReasonPhrase } from 'http-status-codes';

class HttpError extends Error {
  constructor(status, message = getReasonPhrase(status), data = undefined) {
    super(message);

    this.status = status;
    this.data = data;
  }
}

export default HttpError;
