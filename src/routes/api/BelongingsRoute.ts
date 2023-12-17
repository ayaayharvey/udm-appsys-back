import express from 'express';
import BelongingsController from '../../controller/BelongingsController';
import { tokenAuth } from '../../middleware/TokenAuth';

const router = express.Router();
const belongingsController = new BelongingsController();

router.route('/api/belongings/:id?')
    .get(tokenAuth, belongingsController.getBelongings)
    .post(tokenAuth, belongingsController.setBelongings);

export default router;