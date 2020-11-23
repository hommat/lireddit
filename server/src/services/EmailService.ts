import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import { __prod__ } from '../constants/utils';
import { subjects } from '../constants/email';
import { createChangePasswordEmail } from '../utils/createEmail';

export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'lyfi6pdmstakuspc@ethereal.email',
        pass: 'HdTWXgbDM7vrefSwKJ',
      },
    });
  }

  async sendEmail(to: string, html: string) {
    let info = await this.transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: to,
      subject: subjects.CHANGE_PASSWORD,
      html: html,
    });

    if (!__prod__) {
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  }

  sendChangePasswordEmail(to: string, token: string) {
    this.sendEmail(
      to,
      createChangePasswordEmail(process.env.WEB_HOST_CLIENT, token)
    );
  }
}
