import express from 'express';

import { validateBody, validateFile } from '../middlewares/validateRequest.js';
import {
  authenticateUserSchema,
  createUserSchema,
  requireEmailSchema,
  updatePasswordSchema,
  updateUserSchema,
  waterDailySchema,
} from '../validationSchemas/userSchemas.js';
import {
  authenticateUser,
  createUser,
  deleteUserAvatar,
  forgotPassword,
  getCurrentUser,
  removeToken,
  resendVerifiation,
  updatePassword,
  updateUser,
  updateUserAvatar,
  verifyUser,
} from '../controllers/userController.js';
import validateAuth from '../middlewares/validateAuth.js';
import { imageMiddleware } from '../middlewares/fileUploader.js';

const router = express.Router();

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

router
  .route('/current')
  .get(getCurrentUser)
  .patch(validateBody(updateUserSchema), updateUser);

router
  .route('/avatar')
  .delete(deleteUserAvatar)
  .patch(
    imageMiddleware.single('avatar'),
    validateFile('avatar'),
    updateUserAvatar
  );

// Water
router.patch('/water/goal', validateBody(waterDailySchema), updateUser);

export default router;
