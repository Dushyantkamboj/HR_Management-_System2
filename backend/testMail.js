import dotenv from 'dotenv';
import { transporter } from "./src/utils/sendEmail.js";

dotenv.config();

const sendMail = async () => {
    try {
        const result = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "HR Management Email Testing",
            text: "Nodemailer is working successfully!"
        });

        console.log("Email sent:", result.messageId);

    } catch (error) {
        console.log("Email error:", error);
    }
};

sendMail();