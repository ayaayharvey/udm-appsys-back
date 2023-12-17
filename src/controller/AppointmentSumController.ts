import { Request, Response } from "express";
import AppointmentsModel from "../model/AppointmentsModel";

class AppointmentSumController {
    async getAppointmentSum (req: Request, res: Response) {
        const office = req.params.id;
        try {
            const result = await AppointmentsModel.getAppointments(office, 'all');
            let approvedCount = 0;
            let rejectedCount = 0;
            let pendingCount = 0;

            result.rows.forEach((data) => {
                switch (data.appointment_status) {
                    case 'pending': pendingCount ++;
                        break;
                    case 'rejected': rejectedCount ++;
                        break;
                    case 'approved': approvedCount ++;
                        break;
                    default: break;
                }
            })

            res.status(200).send({
                approved: approvedCount,
                rejected: rejectedCount,
                pending: pendingCount
            })
            
        } catch (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    }
}

export default AppointmentSumController;