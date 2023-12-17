import { Request, Response, query } from "express";
import database from "../config/postgresql";
import { encryptPassword } from "../utils/EncryptPassword";
import { generateTemporaryToken, generateToken } from "./TokenMiddleware";
import UserProfileModel from "../model/UserProfileModel";

// middleware to check is user exist.
export async function loginAuthentication(req: Request, res: Response) {
    const { email, password } = req.body;
    const queryToFind = `SELECT * FROM user_account_tbl WHERE user_email = $1`;
    const emailValue = [email];
    const hashedPassword = encryptPassword(password);

    try {
        const client = await database.connect();
        const result = await client.query(queryToFind, emailValue);
        client.release();

        if (result.rowCount === 1) {
            const [user] = result.rows;
            const { user_id, user_password, user_role } = user;

            if (user_password === hashedPassword) {
                const query = `SELECT * FROM user_profile_tbl WHERE user_id = $1`;
                const id = [user_id];

                const getProfile = await database.connect();
                const profile = await getProfile.query(query, id);
                client.release();

                if (user_role == 'visitor') {
                    if (profile.rowCount == 0) {
                        // temporary token to complete the profile.
                        const token = generateTemporaryToken(user_id, email, user_role);
                        return res.status(200).send({
                            status: 'Login successfull',
                            token: token,
                            role: 'visitor'
                        })
                    } else {
                        const token = generateToken(user_id, email, user_role);
                        return res.status(200).send({
                            status: 'Login successfull',
                            token: token,
                            role: 'visitor'
                        })
                    }
                }

                const token = generateToken(user_id, email, user_role);
                return res.status(200).send({
                    status: 'Login successfull',
                    token: token,
                    role: user_role
                })

            }
            return res.status(401).send({ status: 'Invalid password!' })
        }

        res.status(401).send({ status: 'Invalid email!' });
    } catch (err: any) {
        console.error(err);
        res.status(401).send(err?.message);
    }
}
