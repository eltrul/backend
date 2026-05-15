import type { IResponse } from "../../typings/IResponse";
import { sign, verify } from "jsonwebtoken";

export class JWT {
   constructor() {}

   signToken(data: object) {
      return sign(data, "nicwe trwy", {
         algorithm: "HS256",
      });
   }

   parseGrantToken(grantToken: string): IResponse {
      let verifyResult = verify(grantToken, "nicwe trwy");

      if (verifyResult) {
         return {
            data: [
               {
                  message: "OK",
                  data: verifyResult,
               },
            ],
         };
      }

      return {
         errors: [
            {
               message: "Unexcepted error while decompress token.",
            },
         ],
      };
   }
}
