export abstract class MailTemplate<T> {
   public initatorData: T;

   constructor(initatorData: T) {
      this.initatorData = initatorData;
   }

   abstract getResult(): string;
}
