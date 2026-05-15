import path from "path";
import { Mailer } from "../mailer";
import { MailTemplate } from "./mailTemplate";
import { readFileSync } from "fs";

export interface IVerificationCode {
   username: string;
   verificationCode: string;
}

export class VerificationCode extends MailTemplate<IVerificationCode> {
   constructor(initatorData: IVerificationCode) {
      super(initatorData);
   }

   override getResult(): string {
      let content = readFileSync(
         path.join(__dirname, "verificationCode.html"),
      ).toString();

      for (let [key, value] of Object.entries(this.initatorData)) {
         content = content.replaceAll(`{${key}}`, value);
      }

      return content;
   }

   async sendTo(to: string): Promise<boolean> {
      await Mailer.getSingletonTrait().sendMail({
         from: "no-reply <verify@shioru.xyz>",
         to,
         subject: "Starfield Email Verification",
         text: "Starfield Email Verification",
         html: this.getResult(),
      });

      return true;
   }
}
