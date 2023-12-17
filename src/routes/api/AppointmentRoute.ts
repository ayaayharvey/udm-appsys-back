import express from 'express';
import { tokenAuth } from '../../middleware/TokenAuth';
import AppointmentController from '../../controller/ApppoinmentController';

const router = express.Router();
const appointmentController = new AppointmentController();

router.route('/api/appointment/:office?/:status?')
    .get(tokenAuth, appointmentController.getAppointment)
    .post(tokenAuth, appointmentController.setAppointment)
    .put(tokenAuth, appointmentController.updateAppointment);


export default router;