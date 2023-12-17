import { QueryResult } from "pg";
import database from "../config/postgresql";
import { UploadedFile } from "express-fileupload";

class UserProfileModel {
    completeUserProfile(userId: string, fullname: string, address: string, phone: string, avatar: UploadedFile | null): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            // image url.
            let imageBuffer: Buffer | undefined;

            // save image to database.
            if (avatar) {
                imageBuffer = avatar.data;
            }

            const query = `INSERT INTO user_profile_tbl (user_id, user_fullname, user_address, user_phone, user_avatar)
                VALUES ($1, $2, $3, $4, $5)`;
            const values = [userId, fullname, address, phone, imageBuffer];

            try {
                const client = await database.connect();
                await client.query(query, values);
                client.release();
                resolve(true);
            } catch (err) {
                console.log(err);
                reject(err);
            }
        })
    }

    getUserProfile(userId: string): Promise<QueryResult> {
        return new Promise(async (resolve, reject) => {
            const query = `SELECT * FROM user_profile_tbl WHERE user_id = $1`;
            const value = [userId];

            try {
                const client = await database.connect();
                const result = await client.query(query, value);
                client.release();
                resolve(result);
            } catch (err) {
                console.log(err);
                reject(err)
            }
        })
    }

}

export default new UserProfileModel;