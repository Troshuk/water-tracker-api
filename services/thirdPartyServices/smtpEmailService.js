import pug from 'pug';
import path from 'path';
import { convert } from 'html-to-text';
import nodemailer from 'nodemailer';

import serverConfigs from '../../configs/serverConfigs.js';

const { UI_URL, APP_NAME } = serverConfigs.APP;
const { HOST, USERNAME, PASSWORD, PORT, FROM } = serverConfigs.SMTP;

class SmtpEmail {
  #transporter;

  from;

  constructor(transporter, from) {
    this.#transporter = transporter;
    this.from = from;
  }

  send({ from = this.from, ...data }) {
    const mailData = data;

    // If html data present, attach text as well
    if (mailData.html && !mailData.text) {
      mailData.text = convert(mailData.html);
    }

    return this.#transporter.sendMail({
      ...mailData,
      from,
    });
  }

  #sendPug(to, template, subject, data = {}, from = this.from) {
    const html = pug.renderFile(
      path.join(process.cwd(), 'views', 'email', `${template}.pug`),
      {
        subject,
        ...data,
      }
    );

    return this.send({ to, html, subject, from });
  }

  sendEmailVerification(to, token) {
    return this.#sendPug(
      to,
      'emailConfirmation',
      `Your email verification for ${APP_NAME}`,
      { url: `${UI_URL}/verify/${token}` }
    );
  }

  sendPasswordReset(to, token) {
    return this.#sendPug(
      to,
      'resetPassword',
      `Reset Password for ${APP_NAME}`,
      {
        url: `${UI_URL}/password/reset/${token}`,
      }
    );
  }
}

export default new SmtpEmail(
  nodemailer.createTransport({
    host: HOST,
    port: PORT,
    auth: {
      user: USERNAME,
      pass: PASSWORD,
    },
  }),
  FROM
);
