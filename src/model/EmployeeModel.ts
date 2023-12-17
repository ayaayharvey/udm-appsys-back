import { Query, QueryResult } from "pg";
import database from "../config/postgresql";
import { encryptPassword } from "../utils/EncryptPassword";

class EmployeeModel {
    createEmployee(email: string, role: string): Promise<QueryResult> {
        return new Promise(async (resolve, reject) => {
            const query = `INSERT INTO user_account_tbl (user_email, user_password, user_role) VALUES ($1, $2, $3) RETURNING user_id, user_email, user_role`
            const defaultPassword = 'default';
            const hashedPassword =  encryptPassword(defaultPassword);
            const values = [email, hashedPassword, role];

            try {
                const client = await database.connect();
                const result = await client.query(query, values);
                client.release();
                resolve(result);

            } catch (err) {
                reject(err);
            }
        });
    }

    completeProfile(userId: number, fullname: string): Promise<QueryResult> {
        return new Promise(async (resolve, reject) => {
            const query = `INSERT INTO employee_profile_tbl (user_id, user_fullname) VALUES ($1, $2) RETURNING user_fullname, user_avatar`;
            const values = [userId, fullname];

            try {
                const client = await database.connect();
                const result = await client.query(query, values);
                client.release();

                resolve(result);

            } catch (err) {
                reject(err);
            }
        })
    }

    getEmployee (): Promise<QueryResult> {
        return new Promise(async (resolve, reject) => {
            const query = `SELECT U.user_id, U.user_email, U.user_role, P.user_fullname, P.user_avatar
                FROM user_account_tbl AS U JOIN employee_profile_tbl as P ON U.user_id = P.user_id WHERE U.user_role != 'visitor' AND U.user_role != 'admin'`
            
            try {
                const client = await database.connect();
                const result = await client.query(query);
                client.release();

                resolve(result);

            } catch (err) {
                reject(err);
            }
        })
    }

    getProfile (userId: string): Promise<QueryResult> {
        return new Promise ( async (resolve, reject) => {
            const query = `SELECT * FROM employee_profile_tbl WHERE user_id = $1`;
            const values = [userId];

            try {
                const client = await database.connect();
                const result = client.query(query, values);
                client.release();

                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }
}

export default new EmployeeModel;