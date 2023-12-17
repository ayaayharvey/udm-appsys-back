import database from "../config/postgresql";
import { encryptPassword } from "../utils/EncryptPassword";

export function authenticateUser (email: string, password: string): Promise<object> {
    return new Promise(async (resolve, reject) => {
        const findUserQuery = `SELECT * FROM user_account_tbl WHERE user_email = $1`;
        const findUservalue = [email];
        const hashedPassword = encryptPassword(password);

        try {
            const client = await database.connect();
            const result = await client.query(findUserQuery, findUservalue);
            client.release();

            if (result.rowCount === 1) {
                const [user] = result.rows;
                const {user_id, user_password, isConfirmed, is_profile_complete } = user;
    
                if (user_password === hashedPassword) {
                    if (is_profile_complete) {
                        resolve({complete_profile: true, user_id: user_id, user_email: email});
                    } else {
                        resolve({complete_profile: false, user_id: user_id, user_email: email});
                    }
                }
                
                reject(new Error('Invalid password!'));
            }
            reject(new Error('Invalid email!'))

        } catch (err: any) {
            console.error(err);
        }
    })
}