import { Request, Response } from "express";
import { getUserId } from "../utils/GetUserId";
import AppointmentModel from "../model/AppointmentModel";
import { getIO } from "../config/socket";
import UserProfileModel from "../model/UserProfileModel";
import AppointmentsModel from "../model/AppointmentsModel";
import Email from "../utils/Email";

class AppointmentController {
  async setAppointment(req: Request, res: Response) {
    const { date, office, time, purpose } = req.body;
    const token = req.header("Authorization");
    let userId: string = "";

    if (token) {
      userId = getUserId(token);
    }

    try {
      const request = await AppointmentModel.setAppointment(
        userId,
        date,
        office,
        time,
        purpose
      );

      const io = getIO();

      io.to(office).to("admin").emit("new_request", request.rows);

      res.status(200).send({ status: "Appointment sent" });
    } catch (err) {
      res.status(500).send({ err: "Internal Server Error" });
    }
  }

  async updateAppointment(req: Request, res: Response) {
    const { id, status, email, name, office, date, time } = req.body;

    try {
      const isUpdated = await AppointmentModel.updateAppointment(id, status);
      !isUpdated && res.status(500).send("Something went wrong.");

      if (status == "approved") {
        await Email.sendApprovedEmail(email, name, office, date, time);
      } else if (status == "rejected") {
        await Email.sendRejectedEmail(email, name);
      }

      const io = getIO();
      const update = { id, status };

      io.to(office).to("admin").emit("appointment_update", update);

      io.to("Guard").emit("guard_appointment_update", update);

      res.status(200).send({ status: "Updated appointment" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }

  async getAppointment(req: Request, res: Response) {
    const office = req.params.office;
    const status = req.params.status;
    try {
      const result = await AppointmentsModel.getAppointments(office, status);
      res.status(200).send({ appointments: result.rows });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }

  async getAppointmentDetails(req: Request, res: Response) {
    const id = req.params.id;

    try {
      const result = await AppointmentModel.getAppointDetails(id);
      res.status(200).send({ details: result.rows });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }

  async getDailyAppointment(req: Request, res: Response) {
    const date = req.params.date;
    const office = req.params.office;

    try {
      const result = await AppointmentModel.getTodaysAppointment(date, office);
      res.status(200).send({ appointments: result.rows });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default AppointmentController;
