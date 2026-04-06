import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Create a transporter
    // We create a test account on the fly if real creds are missing
    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback to a mock ethereal account for local dev without sending real emails
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    // Define the email options
    const mailOptions = {
        from: 'Digital Library <noreply@digitallibrary.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // Actually send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export default sendEmail;
