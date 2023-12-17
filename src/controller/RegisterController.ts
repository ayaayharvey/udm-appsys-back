import {Request, Response} from 'express';
import RegisterModel from '../model/RegisterModel';

class RegisterController {
    async UserRegistration(req: Request, res: Response) {
        const {email, password} = req.body;
        try {
            await RegisterModel.userRegistration(email, password);
            res.status(200).send({status: 'Registered.'});
        } catch (err) {
            console.error(err);
            res.status(500).send({status: 'Internal Server Error.'});
        }
    }
}

export default RegisterController;