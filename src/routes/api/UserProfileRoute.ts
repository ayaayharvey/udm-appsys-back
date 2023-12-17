import express from 'express';
import UserProfileController from '../../controller/UserProfileController';
import { tokenAuth } from '../../middleware/TokenAuth';
import multer from 'multer';

const router = express.Router();
const userProfileController = new UserProfileController;

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.route('/api/user-profile')
    .get(tokenAuth, userProfileController.getUserProfile)
    .post(tokenAuth, userProfileController.CompleteProfile);

export default router;