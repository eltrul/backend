import { type ErrorHandler } from "elysia";
import type { IResponse } from "../../../typings/IResponse";

export const errorSyntax: ErrorHandler = ({ code, error, set }): IResponse => {
   if (code === "VALIDATION") {
      set.status = 400;
      return {
         errors: [
            {
               message: error.messageValue?.message || "validation error",
            },
         ],
      };
   }

   if (error instanceof Error) {
      return {
         errors: [
            {
               message: error.message,
            },
         ],
      };
   }

   set.status = 500;

   return {
      errors: [
         {
            message: "internal server error",
         },
      ],
   };
};
