import Elysia, { t } from "elysia";
import { httpSessionVerificationMiddleware } from "../../../../helpers/httpSesisonVerificationMiddleware/httpSesisonVerificationMiddleware";
import { Users } from "../../../../users/users";
import type { IResponse } from "../../../../../typings/IResponse";

export const verification = new Elysia({ prefix: "/verification" })
   .use(
      httpSessionVerificationMiddleware({
         shouldUseGatewayVerificationMiddleware: true,
      }),
   )
   .get("/detail", async ({ session, set }) => {
      let user = await Users.getSingletonTrait().getUserBy(
         "userId",
         session.tokenData.sessionOwnerId,
      );
      if (!user) {
         set.status = 500;
         return {
            errors: [
               {
                  message: "invalid user",
               },
            ],
         };
      }

      return {
         data: [
            {
               message: "success",
               data: user.userInstance.toObject(),
            },
         ],
      };
   })
   .post(
      "/requestNewAuthenticationCode",
      async ({ session, set }): Promise<IResponse> => {
         let user = await Users.getSingletonTrait().getUserBy(
            "userId",
            session.tokenData.sessionOwnerId,
         );
         if (!user) {
            set.status = 500;
            return {
               errors: [
                  {
                     message: "invalid user",
                  },
               ],
            };
         }

         let emailCodeRequestResult = await user.requestEmailVerificationCode();
         if (emailCodeRequestResult.errors) {
            set.status = 400;
         }

         return emailCodeRequestResult;
      },
   )
   .post(
      "/submitCode",
      async ({ session, body, set }): Promise<IResponse> => {
         let { code } = body;
         let user = await Users.getSingletonTrait().getUserBy(
            "userId",
            session.tokenData.sessionOwnerId,
         );

         if (!user) {
            set.status = 500;
            return {
               errors: [
                  {
                     message: "invalid user",
                  },
               ],
            };
         }

         let verifyResult = await user.verifyEmail(code);
         if (verifyResult.errors) {
            set.status = 400;
         }

         return verifyResult;
      },
      {
         body: t.Object({
            code: t.String({
               minLength: 8,
               maxLength: 8,
            }),
         }),
      },
   );
