import express from 'express';

import {
  validateBody,
  validateFile,
  validateId,
} from '../middlewares/validateRequest.js';
import {
  authenticateUserSchema,
  createUserSchema,
  requireEmailSchema,
  updatePasswordSchema,
} from '../validationSchemas/userSchemas.js';
import {
  authenticateUser,
  createUser,
  forgotPassword,
  getCurrentUser,
  removeToken,
  resendVerifiation,
  updatePassword,
  updateUserAvatar,
  verifyUser,
} from '../controllers/userController.js';
import validateAuth from '../middlewares/validateAuth.js';
import { imageMiddleware } from '../middlewares/fileUploader.js';

const router = express.Router();
router.param('id', validateId);

router.post('/register', validateBody(createUserSchema), createUser);

router.post('/login', validateBody(authenticateUserSchema), authenticateUser);

router.post(
  '/password/forgot',
  validateBody(requireEmailSchema),
  forgotPassword
);

router.post(
  '/password/reset/:token',
  validateBody(updatePasswordSchema),
  updatePassword
);

router.post('/verify', validateBody(requireEmailSchema), resendVerifiation);
router.get('/verify/:token', verifyUser);

// Apply auth middleware
router.use(validateAuth);

router.post('/logout', removeToken);

router.get('/current', getCurrentUser);

router.patch(
  '/avatar',
  imageMiddleware.single('avatar'),
  validateFile('avatar'),
  updateUserAvatar
);

export default router;
