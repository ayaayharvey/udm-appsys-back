import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

export function tokenAuth (req: Request, res: Response, next: NextFunction) {
    const secretKey = process.env.APP_SECRET_KEY;
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).send('Access denied, token missing');
    }

    try {
        if (secretKey) {
            jwt.verify(token, secretKey);
            next();
        }
    } catch (err) {
        return res.status(403).send({status: 'Invalid token'});
    }
}
