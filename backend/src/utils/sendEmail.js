import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        // Some deployments used "Email_PASS" - support both spellings.
        pass:process.env.EMAIL_PASS || process.env.Email_PASS
    }
});