import chalk from "chalk";
import type { LogCallbackType } from "../typings/logCallbackType";
import type { LogTypes } from "../typings/logTypes";
import moment from "moment";

export class Logger {
   public serviceName: string;
   protected logCallback: Record<string, LogCallbackType>;

   constructor(serviceName: string) {
      this.serviceName = serviceName;
      this.logCallback = {};
   }

   private getColorByType(
      messageType: LogTypes | "white" | "default",
      bold: boolean,
      content: string,
   ): string {
      const messageColors = {
         info: "cyan",
         warning: "yellow",
         error: "red",
         white: "white",
         default: "gray",
      } as const;

      let message = chalk[messageColors[messageType]](content);

      return bold ? chalk.bold(message) : message;
   }

   public registerLogCallback(callback: LogCallbackType): this {
      this.logCallback[callback.listenType] = callback;
      return this;
   }

   private createLogMessageStructure(type: LogTypes, message: string): string {
      let callback = this.logCallback[type];
      if (callback) {
         callback.callback(message, callback);
      }

      return ` [ ${this.getColorByType("white", false, this.serviceName + "  " + moment().format("hh:mm:ss A"))} ] [ ${this.getColorByType(type, true, type)} ] (${this.getColorByType("default", false, process.pid.toString())}) > ${chalk.bold.white(message)}`;
   }

   public info(message: string) {
      console.log(this.createLogMessageStructure("info", message));
   }

   public warn(message: string) {
      console.log(this.createLogMessageStructure("warning", message));
   }

   public error(message: string) {
      console.log(this.createLogMessageStructure("error", message));
   }
}
