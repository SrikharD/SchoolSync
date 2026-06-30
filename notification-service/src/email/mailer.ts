import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter;

// Ethereal is fake SMTP service: emails are sent but caught in a test inbox
// at https://ethereal.email nobody receives them.

export const initMailer = async(): Promise<void> => {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth:{
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    console.log('Mailer initialized. Ethereal inbox:', testAccount.web);
    console.log('Ethereal user: ', testAccount.user);
    console.log('Ethereal pass: ', testAccount.pass);
};

export const sendNotificationEmail = async (
    to: string,
    studentId: number,
    status: string,
    date: string
): Promise<void> => {
    if(!transporter){
        console.error('Mailer not initialized.');
        return;
    }

    const info = await transporter.sendMail({
        from: '"SchoolSync" <noreply@schoolsync.com>',
        to,
        subject: `Attendance Update - ${date}`,
        html: `
        <h2> SchoolSync Attendance Notification <h2>
        <p> This is to inform you that student ID <strong>${studentId}</strong>
        was marked <strong>${status}</strong> on <strong>${date}</strong>.</p>
        <p> Please contact the school if you have any questions. </p>`,
    });

    // This URL lets you view the email in Ethereal inbox
    console.log('Email sent. Preview URL: ', nodemailer.getTestMessageUrl(info));
}