import nodemailer from "nodemailer";
import { config } from "../../app/config";
import type Mail from "nodemailer/lib/mailer";

export class Mailer {
   public static instance: Mailer;
   public mailer: nodemailer.Transporter;

   constructor() {
      this.mailer = nodemailer.createTransport({
         host: "smtp-relay.brevo.com",
         port: 587,
         auth: {
            user: config.brevo.user,
            pass: config.brevo.password,
         },
      });
   }

   public static getSingletonTrait() {
      if (!Mailer.instance) {
         Mailer.instance = new Mailer();
      }

      return Mailer.instance;
   }

   async sendMail(data: Mail.Options) {
      return await this.mailer.sendMail(data);
   }

   async test() {
      const info = await this.mailer.sendMail({
         from: '"ALO VU A" <mixigaming@shioru.xyz>',
         to: "literaryaturtle1@gmail.com",
         subject: "o i i",
         text: "PHAI VU K VU",
         html: "<b>alo vu a phai vu k vu thoi e oi e dung co choi a cong khai het dia chi cua e day</b>",
      });

      console.log("Message sent: %s", info.messageId);
   }
}
