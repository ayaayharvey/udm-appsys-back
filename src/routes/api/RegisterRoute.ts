import express from 'express';
import RegisterController from '../../controller/RegisterController';
import { checkEmailExistence } from '../../middleware/CheckEmailExistence';

const router = express.Router();
const registerController = new RegisterController();

router.route('/api/register')
    .post(checkEmailExistence, registerController.UserRegistration)

export default router;