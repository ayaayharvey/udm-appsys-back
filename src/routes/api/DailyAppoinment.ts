import express from 'express';
import AppointmentController from '../../controller/ApppoinmentController';
import { tokenAuth } from '../../middleware/TokenAuth';

const router = express.Router();
const appointmentController = new AppointmentController();

router.route('/api/daily-appointment/:date?/:office?')
    .get(tokenAuth, appointmentController.getDailyAppointment);

export default router;