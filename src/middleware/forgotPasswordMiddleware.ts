import { Request, Response, NextFunction } from "express";
import database from "../config/postgresql";

export async function forgotPasswordMiddleware (req: Request, res: Response, next: NextFunction) {
    const {email} = req.body;
    const query = `SELECT * FROM user_account_tbl WHERE user_email = $1`;
    const value = [email];
    try {
        const client = await database.connect();
        const result = await client.query(query, value);
        client.release();
        if (result.rowCount <= 0) {
            return res.status(409).send({status: "Email doesn't exist"});
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
} 