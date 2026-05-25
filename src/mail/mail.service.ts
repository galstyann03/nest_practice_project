import { Injectable } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verifyUrl = `http://localhost:3000/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Please click the link below to verify your email address:</p>
        <a href="${verifyUrl}">Verify Email</a>
        <p>If you did not create an account, please ignore this email.</p>`,
    });
  }
}
