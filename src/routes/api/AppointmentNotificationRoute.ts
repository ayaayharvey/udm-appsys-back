import express from "express";
import AppointmentNotificationController from "../../controller/AppointmentNotificationController";
import { tokenAuth } from "../../middleware/TokenAuth";

const router = express.Router();
const appointmentNotificationCOntroller =
  new AppointmentNotificationController();

router
  .route("/api/appointment-notification/:date?/:office?")
  .get(tokenAuth, appointmentNotificationCOntroller.getNotification);

export default router;
