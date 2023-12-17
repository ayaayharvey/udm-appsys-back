import { Request, Response } from "express";
import BelonginsModel from "../model/BelonginsModel";
import { getIO } from "../config/socket";

class BelongingsController {
  async setBelongings(req: Request, res: Response) {
    const { userId, appointmentId, personalItems } = req.body;

    try {
      const io = getIO();
      await BelonginsModel.setBelongings(userId, appointmentId, personalItems);
      io.to("Guard").emit("guard_appointment_update");
      res.status(200).send("belongings set");
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }

  async getBelongings(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const result = await BelonginsModel.getBelogings(id);
      res.status(200).send({ items: result.rows });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
}

export default BelongingsController;
