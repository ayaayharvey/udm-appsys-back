import express from 'express';
import AppointmentController from '../../controller/ApppoinmentController';
import { tokenAuth } from '../../middleware/TokenAuth';

const router = express.Router();
const appointmentController = new AppointmentController();

router.route('/api/appointment-details/:id?')
    .get(tokenAuth, appointmentController.getAppointmentDetails)


export default router;