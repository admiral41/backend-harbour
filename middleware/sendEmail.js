const nodeMail = require('nodemailer');

exports.sendEmail = async (options) => {
    const transporter = nodeMail.createTransport({
        service: process.env.SMTP_SERVICE,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const mailOptions = {
        from: `"Harbour Sparkle" <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
        text: options.text
    };

    await transporter.sendMail(mailOptions);
};