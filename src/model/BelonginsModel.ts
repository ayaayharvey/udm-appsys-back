import { QueryResult } from "pg";
import database from "../config/postgresql";

class BelongingsModel {
    setBelongings(user_id: string, appointment_id: string, belongings: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const client = await database.connect();
            try {
                await client.query('BEGIN');

                if (belongings === 'none') {
                    // Only insert into belongings_tbl
                    const insertQuery = `
                        INSERT INTO belongings_tbl (user_id, appointment_id, personal_items)
                        VALUES ($1, $2, $3)
                    `;
                    const insertValues = [user_id, appointment_id, belongings];
                    await client.query(insertQuery, insertValues);
                } else {
                    // Insert into belongings_tbl and update appointment_tbl
                    const insertQuery = `
                        INSERT INTO belongings_tbl (user_id, appointment_id, personal_items)
                        VALUES ($1, $2, $3)
                    `;
                    const insertValues = [user_id, appointment_id, belongings];
                    await client.query(insertQuery, insertValues);

                    const updateQuery = `
                        UPDATE appointment_tbl
                        SET with_personal_items = true
                        WHERE appointment_id = $1
                    `;
                    const updateValues = [appointment_id];
                    await client.query(updateQuery, updateValues);
                }

                await client.query('COMMIT');
                resolve(true);
            } catch (err) {
                await client.query('ROLLBACK');
                reject(err);
            } finally {
                client.release();
            }
        });
    }

    getBelogings (appointmentId: string): Promise<QueryResult> {
        return new Promise (async (resolve, reject) => {
            const client = await database.connect();
            try {
                const query = `SELECT personal_items FROM belongings_tbl WHERE appointment_id = $1`;
                const value = [appointmentId];

                const result = await client.query(query, value);
                
                resolve(result);
            } catch (err) {
                reject(err);
            } finally {
                client.release();
            }
        })
    }
}

export default new BelongingsModel;
