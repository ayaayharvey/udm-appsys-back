import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import { formatDate } from './FormatDate';
import { generateResetToken } from '../middleware/TokenMiddleware';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})

class Email {
    async sendApprovedEmail(email: string, name: string, department: string, date: string, time: string): Promise<boolean> {
        let officeToDispplay: string = '';
        switch (department) {
            case 'OSA': officeToDispplay = 'Office of Student Affairs';
                break;
            case 'ICTO': officeToDispplay = 'ICTO';
                break;
            case 'Registrar': officeToDispplay = 'Registrar';
                break;
            case 'Guidance': officeToDispplay = 'Guidance';
                break;
            case 'CET': officeToDispplay = 'College of Engineering & Technology';
                break;
            case 'CAS': officeToDispplay = 'College of Art & Science';
                break;
            case 'CHS': officeToDispplay = 'College of Health & Science';
                break;
            case 'CBA': officeToDispplay = 'College of Business Administration';
                break;
        }

        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: 'udmappointment.system@gmail.com',
                to: `${email}`,
                subject: 'Appointment Update.',
                html: this.approvedEmailTemplate(name, officeToDispplay, date, time,)
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(true)
                }
            })
        })
    }

    async sendRejectedEmail(email: string, name: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                form: 'udmappointment.system@gmail.com',
                to: `${email}`,
                subject: 'Appointment Update.',
                html: this.rejectedEmailTemplate(name)
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(true)
                }
            })
        })
    }

    async sendResetPasswordEmail(email: string, url: string) {
        const mailOptions = {
            form: 'udmappointment.system@gmail.com',
            to: `${email}`,
            subject: 'Reset Password',
            html: this.resetPasswordTemplate(url)
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            }
        })
    }

    resetPasswordTemplate(url: string) {
        return `<!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Appointment Status</title>
            <style>
                .header {
                    padding: 0 0 24px 0;
                }
            
                .header img {
                    width: 300px;
                }
            
                .container {
                    width: 100%;
                    height: 100%;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
            
                .email {
                    width: 80%;
                    margin: 0 auto;
                    background-color: #fff;
                    padding: 20px;
                }
            
                .email-header {
                    background-color: #333;
                    color: #fff;
                    padding: 20px;
                    text-align: center;
                }
            
                .email-body {
                    padding: 20px;
                }
            
                .email-footer {
                    background-color: #333;
                    color: #fff;
                    padding: 20px;
                    text-align: center;
                }
            
                footer {
                    display: flex;
                    align-items: center;
                    background-color: #15803D;
                    color: white;
                    padding: 12px 24px;
                    font-size: 12px;
                    margin: 24px 0 0 0;
                }
            
                footer img {
                    width: 48px;
                }
            
                svg icon {
                    color: white;
                    width: 24px;
                }
            
                .nav {
                
                }
            </style>
        </head>
            
        <body>
            <div class="container">
                <div class="email">
                    <div class="header">
                        <img src="https://firebasestorage.googleapis.com/v0/b/udm-appointment-system-abb45.appspot.com/o/logo.png?alt=media&token=3d82be68-b19b-4467-a0c8-35dfa116d939&_gl=1*9t1wrj*_ga*NzgzNTQ2ODI3LjE2OTc4MDc0NzA.*_ga_CW55HF8NVT*MTY5NzgwNzQ3MC4xLjEuMTY5NzgwNzYxMi41NC4wLjA."
                            alt="header" />
                    </div>
                    <div class="content">
                    We recently received a request to reset your password for your UDM Appointment Syste  account. To proceed with the password reset process, please click on the link below:
                    <br><br>
                    <a href='${url}'>${url}</a>
                    <br><br>
                    Please note that this password reset link is only valid for the next 15 minutes. If you do not complete the reset within this time frame, you will need to request another password reset.
                
                    </div>
                    <footer class=''>
                        <aside>
                            <img class=''
                                src='https://firebasestorage.googleapis.com/v0/b/udm-appointment-system-abb45.appspot.com/o/footer-logo.png?alt=media&token=05b65823-d7ca-4bd6-89f5-19926f122ed7&_gl=1*1s2npca*_ga*NzgzNTQ2ODI3LjE2OTc4MDc0NzA.*_ga_CW55HF8NVT*MTY5NzgwNzQ3MC4xLjEuMTY5NzgwODA5MC40NC4wLjA.'
                                alt='logo' />
                            <p>Universidad de Manila<br />One Mehan Gardens Manila, Philippines 1000</p>
                        </aside>
                    </footer>
                </div>
            </div>
        </body>
        </html>
    `
    }

    approvedEmailTemplate(name: string, officeToDisplay: string, date: string, time: string) {
        return `
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Appointment Status</title>
                <style>
                    .header {
                        padding: 0 0 24px 0;
                    }
                
                    .header img {
                        width: 300px;
                    }
                
                    .container {
                        width: 100%;
                        height: 100%;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }
                
                    .email {
                        width: 80%;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 20px;
                    }
                
                    .email-header {
                        background-color: #333;
                        color: #fff;
                        padding: 20px;
                        text-align: center;
                    }
                
                    .email-body {
                        padding: 20px;
                    }
                
                    .email-footer {
                        background-color: #333;
                        color: #fff;
                        padding: 20px;
                        text-align: center;
                    }
                
                    footer {
                        display: flex;
                        align-items: center;
                        background-color: #15803D;
                        color: white;
                        padding: 12px 24px;
                        font-size: 12px;
                        margin: 24px 0 0 0;
                    }
                
                    footer img {
                        width: 48px;
                    }
                
                    svg icon {
                        color: white;
                        width: 24px;
                    }
                
                    .nav {
                    
                    }
                </style>
            </head>
                
            <body>
                <div class="container">
                    <div class="email">
                        <div class="header">
                            <img src="https://firebasestorage.googleapis.com/v0/b/udm-appointment-system-abb45.appspot.com/o/logo.png?alt=media&token=3d82be68-b19b-4467-a0c8-35dfa116d939&_gl=1*9t1wrj*_ga*NzgzNTQ2ODI3LjE2OTc4MDc0NzA.*_ga_CW55HF8NVT*MTY5NzgwNzQ3MC4xLjEuMTY5NzgwNzYxMi41NC4wLjA."
                                alt="header" />
                        </div>
                        <div class="content">
                            Dear <b>${name}</b>,<br><br><br>
                            This is an appointment confirmation of our scheduled meeting with <b>${officeToDisplay}</b> on
                            <b>${formatDate(date)}</b> at <b>${time} Session</b>.<br><br>
                            I wanted to ensure that we are still on track for this meeting.<br><br>
                            Please let me know if you need to make any schedule changes or have any questions or
                            concerns<br><br><br>
                            Regards,<br>
                            Universidad de Manila
                        </div>
                        <footer class=''>
                            <aside>
                                <img class=''
                                    src='https://firebasestorage.googleapis.com/v0/b/udm-appointment-system-abb45.appspot.com/o/footer-logo.png?alt=media&token=05b65823-d7ca-4bd6-89f5-19926f122ed7&_gl=1*1s2npca*_ga*NzgzNTQ2ODI3LjE2OTc4MDc0NzA.*_ga_CW55HF8NVT*MTY5NzgwNzQ3MC4xLjEuMTY5NzgwODA5MC40NC4wLjA.'
                                    alt='logo' />
                                <p>Universidad de Manila<br />One Mehan Gardens Manila, Philippines 1000</p>
                            </aside>
                        </footer>
                    </div>
                </div>
            </body>
            </html>
        `
    }

    rejectedEmailTemplate(name: string) {
        return `
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Appointment Status</title>
                <style>
                    .header {
                        padding: 0 0 24px 0;
                    }
                
                    .header img {
                        width: 300px;
                    }
                
                    .container {
                        width: 100%;
                        height: 100%;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }
                
                    .email {
                        width: 80%;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 20px;
                    }
                
                    .email-header {
                        background-color: #333;
                        color: #fff;
                        padding: 20px;
                        text-align: center;
                    }
                
                    .email-body {
                        padding: 20px;
                    }
                
                    .email-footer {
                        background-color: #333;
                        color: #fff;
                        padding: 20px;
                        text-align: center;
                    }
                
                    footer {
                        display: flex;
                        align-items: center;
                        background-color: #15803D;
                        color: white;
                        padding: 12px 24px;
                        font-size: 12px;
                        margin: 24px 0 0 0;
                    }
                
                    footer img {
                        width: 48px;
                    }
                
                    svg icon {
                        color: white;
                        width: 24px;
                    }
                
                    .nav {
                    
                    }
                </style>
            </head>
                
            <body>
                <div class="container">
                    <div class="email">
                        <div class="header">
                            <img src="https://firebasestorage.googleapis.com/v0/b/udm-appointment-system-abb45.appspot.com/o/logo.png?alt=media&token=3d82be68-b19b-4467-a0c8-35dfa116d939&_gl=1*9t1wrj*_ga*NzgzNTQ2ODI3LjE2OTc4MDc0NzA.*_ga_CW55HF8NVT*MTY5NzgwNzQ3MC4xLjEuMTY5NzgwNzYxMi41NC4wLjA."
                                alt="header" />
                        </div>
                        <div class="content">
                        Dear <b>${name}</b>,<br><br><br>

                        I hope this message finds you well. We appreciate your interest in scheduling an appointment with us. However, we regret to inform you that your appointment request has been rejected for the following reasons: <br><br>

                        <b>Scheduling Conflict:</b> The requested date and time were already booked due to prior appointments or conflicting commitments, making it impossible to accommodate your appointment.
                        We understand the importance of your request and apologize for any inconvenience this may cause.<br><br>

                        <b>Full Schedule:</b> Our schedule may have been fully booked, leaving no available slots for the requested date.
                        We are dedicated to providing timely and efficient services, and in this instance, we were unable to find an opening.<br><br>

                        <b>Limited Availability:</b> The specific service or expertise requested may not be available on the specified date.
                        We strive to offer the best possible service and ensure that you receive the expertise required for your needs.<br><br>

                        We understand that this news may be disappointing, and we sincerely apologize for any inconvenience this may have caused.
                        We value your business and would like to work with you to find a suitable alternative.<br><br>
                        If you are flexible with your appointment date and time or require a different service or expertise, please feel free to reach out to us so that we can explore other options that may better suit your needs.
                        <br><br>
                        Thank you for considering our services, and we hope to have the opportunity to serve you in the future. If you have any further questions or require assistance, please do not hesitate to contact us.
                        <br><br>
                        Once again, we apologize for any inconvenience this may have caused and appreciate your understanding. We look forward to the possibility of scheduling an appointment with you in the future.
                        <br><br><br>
                        Best regards,<br>
                        Universidad De Manila
                        
                        </div>
                        <footer class=''>
                            <aside>
                                <img class=''
                                    src='https://firebasestorage.googleapis.com/v0/b/udm-appointment-system-abb45.appspot.com/o/footer-logo.png?alt=media&token=05b65823-d7ca-4bd6-89f5-19926f122ed7&_gl=1*1s2npca*_ga*NzgzNTQ2ODI3LjE2OTc4MDc0NzA.*_ga_CW55HF8NVT*MTY5NzgwNzQ3MC4xLjEuMTY5NzgwODA5MC40NC4wLjA.'
                                    alt='logo' />
                                <p>Universidad de Manila<br />One Mehan Gardens Manila, Philippines 1000</p>
                            </aside>
                        </footer>
                    </div>
                </div>
            </body>
            </html>
        `
    }

}
export default new Email;