import { StatusCodes } from 'http-status-codes';

import catchErrors from '../decorators/catchErrors.js';
import HttpError from '../helpers/HttpError.js';
import userService from '../services/modelServices/UserService.js';
import { transformUser } from '../transformers/userTransformer.js';
import cloudinaryService from '../services/thirdPartyServices/cloudinaryService.js';
import fileService from '../services/fileService.js';
import smtpEmailService from '../services/thirdPartyServices/smtpEmailService.js';

const getUserId = (req) => req.user._id;

export const createUser = catchErrors(async ({ body }, res) => {
  const token = await userService.createUserWithToken(body);
  await smtpEmailService.sendEmailVerification(body.email, token);

  res.status(StatusCodes.CREATED).json({
    message: 'User has been created and email verification has been sent',
  });
});

export const resendVerifiation = catchErrors(async ({ body }, res) => {
  const { email } = body;
  const token = await userService.reCreateVerificationToken(email);
  await smtpEmailService.sendEmailVerification(email, token);

  res.status(StatusCodes.CREATED).json({
    message: 'Email verification has been sent',
  });
});

export const verifyUser = catchErrors(async (req, res) => {
  const { token } = req.params;

  if (!(await userService.verifyUserByToken(token))) {
    throw new HttpError(StatusCodes.NOT_FOUND, 'Verification token is invalid');
  }

  res.json({ message: 'Your email has been successfully verified' });
});

export const forgotPassword = catchErrors(async ({ body: { email } }, res) => {
  const token = await userService.createPasswordResetToken(email);
  await smtpEmailService.sendPasswordReset(email, token);

  res.json({ message: 'Password reset was sent via email' });
});

export const updatePassword = catchErrors(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!(await userService.resetPasswordByToken(token, password))) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Reset token is invalid');
  }

  res.json({ message: 'Password has been successfully reset' });
});

export const authenticateUser = catchErrors(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.authenticateUser(email, password);

  res.json({ user: transformUser(user), token: user.token });
});

export const removeToken = catchErrors(async (req, res) => {
  await userService.removeToken(getUserId(req));

  res.status(StatusCodes.NO_CONTENT).send();
});

export const getCurrentUser = catchErrors(({ user }, res) => {
  res.json(transformUser(user));
});

export const updateUserAvatar = catchErrors(async (req, res) => {
  const { path } = req.file;

  await fileService.imageResize(path);

  const avatarURL = await cloudinaryService.upload(path, 'users/avatars');

  await fileService.removeFile(path);

  const user = await userService.update(getUserId(req), { avatarURL });

  res.json(transformUser(user));
});

export const updateUser = catchErrors(async (req, res) => {
  const { old_password } = req.body;

  // If we are updating password check if old password is valid
  if (old_password) {
    if (!userService.validateUsersPassword(req.user, old_password)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Your old password is incorrect'
      );
    }

    // Remove it from the request body
    delete req.body.old_password;
  }

  const user = await userService.update(getUserId(req), req.body);

  res.json(transformUser(user));
});
