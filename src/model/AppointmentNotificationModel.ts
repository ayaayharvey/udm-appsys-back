import { QueryResult } from "pg";
import database from "../config/postgresql";
class AppointmentNotificationModel {
  getTodaysAppointmentNotification(
    date: string,
    office: string
  ): Promise<QueryResult> {
    return new Promise(async (resolve, reject) => {
      // const timezone = "America/New_York"; //Eastern
      // const timezone = "America/Chicago";  //Central
      // const timezone = "America/Denver"; //Mountain
      // const timezone = "America/Los_Angeles"; //Pacific
      // const timezone = "Europe/Berlin";
      const timezone = "Asia/Manila";

      let query = `
            SELECT *
                FROM (
                    SELECT
                        appointment_tbl.appointment_id,
                        appointment_tbl.appointment_time,
                        appointment_tbl.appointment_date,
                        appointment_tbl.appointment_office,
                        appointment_tbl.appointment_status,
                        user_profile_tbl.user_fullname,
                        belongings_tbl.personal_items,
                        EXTRACT(HOUR FROM current_timestamp AT TIME ZONE '${timezone}') as hour_time,
                        CASE
                            WHEN appointment_tbl.appointment_time = 'AM' THEN EXTRACT(HOUR FROM current_timestamp AT TIME ZONE '${timezone}') >= 12
                            WHEN appointment_tbl.appointment_time = 'PM' THEN EXTRACT(HOUR FROM current_timestamp AT TIME ZONE '${timezone}') >= 17
                        END AS overstay
                    FROM appointment_tbl 
                    LEFT JOIN user_profile_tbl ON appointment_tbl.user_id = user_profile_tbl.user_id
                    LEFT JOIN belongings_tbl ON appointment_tbl.appointment_id = belongings_tbl.appointment_id
                    WHERE appointment_tbl.appointment_date = $1 AND appointment_tbl.appointment_status = 'approved'
                    AND belongings_tbl.personal_items is not null
                ) AS subquery_alias
                WHERE overstay = true`;
      const value = [date];

      try {
        const client = await database.connect();
        const result = await client.query(query, value);
        client.release();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default new AppointmentNotificationModel();
