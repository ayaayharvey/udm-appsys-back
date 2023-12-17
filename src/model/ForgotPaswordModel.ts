import database from "../config/postgresql";
import { generateResetToken } from "../middleware/TokenMiddleware";
import Email from "../utils/Email";
import { encryptPassword } from "../utils/EncryptPassword";

class ForgotPasswordModel {
    forgotPassword(email: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const token = generateResetToken(email);
                const resetUrl = `http://192.168.1.4:3000/reset-password?token=${token}`

                await Email.sendResetPasswordEmail(email, resetUrl);
                resolve(true);
            } catch (err) {
                reject(err);
            }
        })
    }

    resetPassword(password: string, email: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const client = await database.connect()
            const hashedPassword = encryptPassword(password);
            try {
                const query = `UPDATE user_account_tbl SET user_password = $1 WHERE user_email = $2`
                const value = [hashedPassword, email];

                const result = await client.query(query, value);
                client.release();

                resolve(true);
            } catch (err) {
                reject(err);
            }
        })
    }
}

export default new ForgotPasswordModel;