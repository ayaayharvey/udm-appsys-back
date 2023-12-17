import express from 'express';
import { tokenAuth } from '../../middleware/TokenAuth';
import AppointmentSumController from '../../controller/AppointmentSumController';

const router = express.Router();
const appointmentSum = new AppointmentSumController();

router.route('/api/summary-count/:id')
    .get(appointmentSum.getAppointmentSum)

export default router;