import { Request, Response } from "express";
import EmployeeModel from "../model/EmployeeModel";
import { getIO } from "../config/socket";
import jwt from "jsonwebtoken"

interface User {
    user_id: string,
    user_email: string,
}

class EmployeeController {
    async createEmployee(req: Request, res: Response) {
        const { fullname, email, office } = req.body;

        try {
            const result = await EmployeeModel.createEmployee(email, office);
            const userId = await result.rows[0]?.user_id;

            const profile = await EmployeeModel.completeProfile(userId, fullname);

            const user = result.rows.map((resultRow) => {
                const matchingProfile = profile.rows.find((profileRow) => profileRow.key === resultRow.key);

                // Merge the data from resultRow and matchingProfile if found
                return matchingProfile ? { ...resultRow, ...matchingProfile } : resultRow;
            });

            const io = getIO();
            io.emit('new_user', (user));

            res.status(200).send({ status: 'user created' });

        } catch (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    }

    async getEmployee(req: Request, res: Response) {
        try {
            const result = await EmployeeModel.getEmployee();
            const employees = result.rows;

            res.status(200).send({ employees: employees });

        } catch (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    }

    async getProfile(req: Request, res: Response) {
        const token = req.header('Authorization');
        const secretKey = process.env.APP_SECRET_KEY;  
        let userId: string = '';
        let decoded;

        if (token && secretKey) {
            decoded = jwt.verify(token, secretKey) as User;
            userId = decoded?.user_id;
        }

        try {
            const result = await EmployeeModel.getProfile(userId);
            res.status(200).send({profile: result.rows});
        } catch (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    }
}

export default EmployeeController;