import express from 'express';
import ForgotPasswordController from '../../controller/ResetPasswordController';
import { forgotPasswordMiddleware } from '../../middleware/forgotPasswordMiddleware';

const router = express.Router();
const forgotPasswordController = new ForgotPasswordController();

router.route(`/api/forgot-password`)
    .post(forgotPasswordMiddleware, forgotPasswordController.forgotPassword)

export default router;