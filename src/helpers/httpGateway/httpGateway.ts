import { type PreContext } from "elysia";
import { HttpGatewayHelper } from "./httpGatewayHelper";

export const httpGateway = async (ctx: PreContext) => {
   const { request, set } = ctx;
   const requestId = request.headers.get("x-starfield-req-id");
   const sign = request.headers.get("x-starfield-req-sign");
   if (!requestId || !sign) {
      set.status = 400;
      throw new Error(
         "no x-starfield-req-id or x-starfield-req-sign header key provided.",
      );
   }

   const isValid = await HttpGatewayHelper.verify(requestId, sign);

   if (!isValid) {
      set.status = 401;
      throw new Error("you are not allowed to access this resources.");
   }
};
