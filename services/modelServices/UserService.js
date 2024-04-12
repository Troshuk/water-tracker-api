import { StatusCodes } from 'http-status-codes';

import HttpError from '../../helpers/HttpError.js';
import User from '../../models/User.js';
import cryptoService from '../cryptoService.js';
import BaseModelService from './BaseModelService.js';

class UserService extends BaseModelService {
  verifyUserByToken(token) {
    return this.updateOne(
      {
        verificationToken: cryptoService.encrypt(token),
        verificationExpire: { $gt: Date.now() },
        verified: false,
      },
      {
        verificationToken: null,
        verificationExpire: null,
        verified: true,
      }
    );
  }

  resetPasswordByToken(token, password) {
    return this.updateOne(
      {
        passwordResetToken: cryptoService.encrypt(token),
        passwordResetExpire: { $gt: Date.now() },
      },
      {
        passwordResetToken: null,
        passwordResetExpire: null,
        password,
      }
    );
  }

  async authenticateUser(email, password) {
    const user = await this.find({ email }, '+password +verified');

    if (!user || !this.validateUsersPassword(user, password)) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Email or password is wrong'
      );
    }

    if (!user.verified) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Email verification is required to be able to log in'
      );
    }

    await user.createAuthToken();

    return user;
  }

  removeToken(id) {
    return this.update(id, { token: null });
  }

  async createPasswordResetToken(email) {
    const user = await this.find({ email }, '+passwordResetExpire');

    if (!user) throw new HttpError(StatusCodes.NOT_FOUND);

    if (user.passwordResetExpire && user.passwordResetExpire > Date.now()) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'You have already requested password reset and you cannot request it again until current token expires'
      );
    }

    return user.createPasswordResetToken();
  }

  async createUserWithToken(data) {
    if (await this.checkIfExists({ email: data.email })) {
      throw new HttpError(StatusCodes.CONFLICT, 'Email is already in use');
    }

    return (await this.create(data)).createVerificationToken();
  }

  async reCreateVerificationToken(email) {
    const user = await this.find({ email }, '+verified');

    if (!user) throw new HttpError(StatusCodes.NOT_FOUND);

    if (user.verified) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Your email has already been verified'
      );
    }

    return user.createVerificationToken();
  }

  validateUsersPassword(user, password) {
    return user.validatePassword(password);
  }
}

export default new UserService(User);
