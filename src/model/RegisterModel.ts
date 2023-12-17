import database from "../config/postgresql";
import { QueryResult } from "pg";
import { encryptPassword } from "../utils/EncryptPassword";

class RegisterModel {
    userRegistration(email: string, password: string): Promise<QueryResult> {
        return new Promise(async (resolve, reject) => {
            const query = `INSERT INTO user_account_tbl (user_email, user_password) VALUES($1, $2)`;
            const hashedPassword = encryptPassword(password);
            const values = [email, hashedPassword];

            try {
                const client = await database.connect();
                const result = await client.query(query, values);
                client.release();
                resolve(result)
            } catch (err) {
                reject(err);
            }
        })
    } 
}

export default new RegisterModel;