import { QueryResult } from "pg";
import database from "../config/postgresql";

class AppointmentsModel {
    getAppointments(office: string, status: string): Promise<QueryResult> {
        return new Promise(async (resolve, reject) => {
            let query = `SELECT appointment_tbl.appointment_id, appointment_tbl.appointment_date, appointment_tbl.appointment_time,
            appointment_tbl.appointment_status, appointment_tbl.appointment_office, user_profile_tbl.user_id, user_profile_tbl.user_fullname, user_account_tbl.user_email
            FROM appointment_tbl 
            LEFT JOIN user_profile_tbl ON appointment_tbl.user_id = user_profile_tbl.user_id
            LEFT JOIN user_account_tbl ON appointment_tbl.user_id = user_account_tbl.user_id`;

            // if admin will select all if not will select depends on what office.
            if (office != 'admin') {
                query += ` WHERE appointment_tbl.appointment_office = '${office}' `;
            }

            if (status != 'all') {
                if (office == 'admin') {
                    query += ` WHERE appointment_tbl.appointment_status = '${status}' `
                } else {
                    query += ` AND appointment_tbl.appointment_status = '${status}' `
                }
            }

            query += ` ORDER BY appointment_tbl.appointment_date ASC`;

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
}

export default new AppointmentsModel;