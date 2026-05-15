import { HTTP_GATEWAY_HMAC_SECRET } from "../../../app/secret";
import { API_GATEWAY_URL } from "../../../app/servicesMap";
import type { IResponse } from "../../../typings/IResponse";
import axios, { isAxiosError } from "axios";

export class HttpGatewayHelper {
   constructor() {}

   // static async verifyRequestId(requestId: string): Promise<IResponse> {
   //    console.log(API_GATEWAY_URL + "/validate");
   //    try {
   //       let request = await axios.get(API_GATEWAY_URL + "/validate", {
   //          headers: {
   //             "x-starfield-req-id": requestId,
   //          },
   //       });

   //       return {
   //          data: [
   //             {
   //                message: "OK",
   //             },
   //          ],
   //       };
   //    } catch (error) {
   //       if (isAxiosError(error)) {
   //          return {
   //             errors: [
   //                {
   //                   message: error.message,
   //                },
   //             ],
   //          };
   //       }
   //    }

   //    return {
   //       errors: [
   //          {
   //             message: "unknown error occured when try to verify the token.",
   //          },
   //       ],
   //    };
   // }
   //

   static async sign(data: string) {
      return new Bun.CryptoHasher("sha256", HTTP_GATEWAY_HMAC_SECRET)
         .update(data)
         .digest("hex");
   }

   static async verify(data: string, sign: string) {
      return sign == (await HttpGatewayHelper.sign(data));
   }
}
