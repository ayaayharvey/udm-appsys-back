import express from 'express';
import { loginAuthentication } from '../../middleware/LoginAuthentication';

const router = express.Router();

router.route('/api/login-authentication')
    .post(loginAuthentication)

export default router;