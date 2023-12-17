import { QueryResult } from "pg";
import database from "../config/postgresql";
class AppointmentModel {
    setAppointment(userId: string, date: string, office: string, time: string, purpose: string): Promise<QueryResult> {
        return new Promise(async (resolve, reject) => {
            const query = `
            WITH inserted_appointment AS (
                INSERT INTO appointment_tbl (user_id, appointment_date, appointment_office, appointment_time, appointment_purpose) 
                VALUES ($1, $2, $3, $4, $5)
                RETURNING appointment_id, user_id, appointment_office, appointment_date, appointment_time, appointment_status
              )
              SELECT
                  inserted_appointment.appointment_id,
                  inserted_appointment.appointment_date,
                  inserted_appointment.appointment_time,
                  inserted_appointment.appointment_office,
                  inserted_appointment.appointment_status,
                  user_account_tbl.user_email,
                  user_profile_tbl.info_id,
                  user_profile_tbl.user_id,
                  user_profile_tbl.user_fullname
              FROM inserted_appointment
              LEFT JOIN user_account_tbl ON inserted_appointment.user_id = user_account_tbl.user_id
              LEFT JOIN user_profile_tbl ON inserted_appointment.user_id = user_profile_tbl.user_id
              `;

            const values = [userId, date, office, time, purpose];

            try {
                const client = await database.connect();
                const result = await client.query(query, values);
                client.release();

                resolve(result);
            } catch (err: any) {
                console.log(err)
                reject(new Error(err))
            }
        })
    }

    updateAppointment(id: string, status: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const query = `UPDATE appointment_tbl SET appointment_status = $1 WHERE appointment_id = $2`;
            const values = [status, id];
            try {
                const client = await database.connect();
                await client.query(query, values);
                client.release();
                
                resolve(true)
            } catch (err) {
                reject(err)
            }
        })
    }

    getAppointDetails(id: string): Promise<QueryResult> {
        return new Promise(async (resolve, reject) => {
            const query = `SELECT appointment_tbl.*, user_profile_tbl.*, user_account_tbl.user_email
            FROM appointment_tbl
            LEFT JOIN user_profile_tbl ON appointment_tbl.user_id = user_profile_tbl.user_id
            LEFT JOIN user_account_tbl ON appointment_tbl.user_id = user_account_tbl.user_id
            WHERE appointment_tbl.appointment_id = $1;`
            const value = [id];

            try {
                const client = await database.connect();
                const result = await client.query(query, value);
                client.release();
                resolve(result);

            } catch (err) {
                reject(err);
            }
        })
    }

    getTodaysAppointment(date: string, office: string): Promise<QueryResult> {
        return new Promise(async (resolve, reject) => {
            let query = `
            SELECT
	            appointment_tbl.appointment_id,
	            appointment_tbl.appointment_time,
	            appointment_tbl.appointment_date,
                appointment_tbl.appointment_office,
                appointment_tbl.appointment_status,
	            user_profile_tbl.user_fullname
            FROM appointment_tbl 
            LEFT JOIN user_profile_tbl ON appointment_tbl.user_id = user_profile_tbl.user_id
            WHERE appointment_tbl.appointment_date = $1 `;
            const value = [date];

            if (office == 'Guard') {
                query += `AND appointment_tbl.appointment_status IN ('approved', 'noshow', 'attended')`
            }

            if (office != 'Guard') {
                query += `  AND appointment_tbl.appointment_status = 'approved'`
            }

            if (office != 'admin' && office != 'Guard') {
                query += ' AND appointment_tbl.appointment_office = $2'
                value.push(office);
            }

            try {
                const client = await database.connect();
                const result = await client.query(query, value)
                client.release();
                resolve(result);
            } catch (err) {
                reject(err);
            }
        })
    }
}

export default new AppointmentModel;