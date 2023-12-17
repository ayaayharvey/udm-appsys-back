import express from "express";
import userRoute from "./api/RegisterRoute";
import loginAuthRoute from "./api/LoginAuthRoute";
import userProfileRoute from "./api/UserProfileRoute";
import appoinmentRoute from "./api/AppointmentRoute";
import appoinmentSummary from "./api/SummaryRoute";
import employeeRoute from "./api/EmployeeRoute";
import employeeProfileRouter from "./api/EmployeeProfileRoute";
import appointmentDetails from "./api/AppointmentDetailsRoute";
import appointmentNotification from "./api/AppointmentNotificationRoute";
import dailyappointment from "./api/DailyAppoinment";
import belongingsRoute from "./api/BelongingsRoute";
import forgotPasswordRoute from "./api/ForgoPasswordRoute";
import resetPasswordRoute from "./api/ResetPasswordRoute";

const router = express.Router();

// initialize every route or endpoints in api folder.
router.use(userRoute);
router.use(loginAuthRoute);
router.use(userProfileRoute);
router.use(appoinmentRoute);
router.use(appoinmentSummary);
router.use(employeeRoute);
router.use(employeeProfileRouter);
router.use(appointmentDetails);
router.use(appointmentNotification);
router.use(dailyappointment);
router.use(belongingsRoute);
router.use(forgotPasswordRoute);
router.use(resetPasswordRoute);

export default router;
