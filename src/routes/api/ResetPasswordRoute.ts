import express from 'express';
import ForgotPasswordController from '../../controller/ResetPasswordController';
import { tokenAuth } from '../../middleware/TokenAuth';

const router = express.Router();
const forgotPasswordController = new ForgotPasswordController();

router.route('/api/reset-password')
    .post(tokenAuth, forgotPasswordController.resetPassword)

export default router;