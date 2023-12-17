import { Request, Response } from "express"
import ForgotPaswordModel from "../model/ForgotPaswordModel";
import { getEmail } from "../utils/GetUserId";

class ForgotPasswordController {
    async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;
        try {
            const sentEmail = await ForgotPaswordModel.forgotPassword(email);
            res.status(200).send({ status: 'Email sent.' })

        } catch (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    }

    async resetPassword(req: Request, res: Response) {
        const { password } = req.body;
        const token = req.header('Authorization');

        let email: string = ''

        if (token) {
            email = getEmail(token);
        }
        
        try {
            const result = await ForgotPaswordModel.resetPassword(password, email);
            res.status(200).send({ status: 'Password Updated' });
        } catch (err) {
            console.log(err);
            res.status(500).send({ status: 'Internal Server Error' })
        }
    }
}

export default ForgotPasswordController;