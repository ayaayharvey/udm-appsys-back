import { Request, Response} from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import UserProfileModel from '../model/UserProfileModel';
import fileUpload from 'express-fileupload';
import { getUserId } from '../utils/GetUserId';

dotenv.config();

interface User {
    user_id: string,
    user_email: string,
}

class UserProfileController {
    async CompleteProfile(req: Request, res: Response) {
        const { fullname, address, phone} = req.body;
        const avatar = req.files?.avatar as fileUpload.UploadedFile;
        const token = req.header('Authorization');

        let userId: string = ''

        if (token) {
            userId = getUserId(token);
        }   

        try {
            const result  = await UserProfileModel.completeUserProfile(userId, fullname, address, phone, avatar);
            !result && res.status(500).send('Something went wrong.');

            res.status(200).send({status: 'profile completed.'});
            
        } catch (err) {
            console.error(err);
            res.status(500).send({status: 'Internal Server Error.'});
        }
    }

    async getUserProfile (req: Request, res: Response) {
        let decoded;
        let userId = '';
        const token = req.header('Authorization');
        const secretKey = process.env.APP_SECRET_KEY;

        // check if token and secretkey exist.
        if (token && secretKey) {
            decoded = jwt.verify(token, secretKey) as User;
            userId = decoded?.user_id;
        }

        try {
            const result = await UserProfileModel.getUserProfile(userId);
            
            res.status(200).send({result: result.rows});
        } catch (err) {
            console.error(err);
            res.status(500).send({status: 'Internal Server Error.'});
        }
    }
}

export default UserProfileController;