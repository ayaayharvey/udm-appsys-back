import { Request, Response } from "express";
import { getUserId } from "../utils/GetUserId";
import AppointmentModel from "../model/AppointmentModel";
import { getIO } from "../config/socket";
import UserProfileModel from "../model/UserProfileModel";
import AppointmentNotificationModel from "../model/AppointmentNotificationModel";
import Email from "../utils/Email";

class AppointmentNotificationController {
  async getNotification(req: Request, res: Response) {
    const date = req.params.date;
    const office = req.params.office;

    try {
      const result =
        await AppointmentNotificationModel.getTodaysAppointmentNotification(
          date,
          office
        );
      res.status(200).send({ notifications: result.rows });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default AppointmentNotificationController;
