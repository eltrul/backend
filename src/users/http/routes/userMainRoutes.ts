import Elysia from "elysia";
import { httpSessionVerificationMiddleware } from "../../../helpers/httpSesisonVerificationMiddleware/httpSesisonVerificationMiddleware";
import { Users } from "../../users";
import { BaseConfigurationSchema } from "../../../configuration/baseConfigurationSchema";

export const userMainRoutes = new Elysia()
   .use(httpSessionVerificationMiddleware())
   .get("/baseUserAccountConfigurationKey", async ({ set, session }) => {
      let userId = session.tokenData.sessionOwnerId;
      let user = await Users.getSingletonTrait().getUserBy("userId", userId);
      if (!user) {
         set.status = 400;
         return {
            errors: [
               {
                  message: "user not found.",
               },
            ],
         };
      }

      let configureObject =
         BaseConfigurationSchema.getSpecificSingletonTrait("userSettings");
      if (!configureObject) {
         set.status = 500;
         return {
            errors: [
               {
                  message: "unexcepted error.",
               },
            ],
         };
      }

      let configurationObjectId = user.getUserConfigureObjectId();

      let objectData = await configureObject.getObject(configurationObjectId);
      return {
         data: [
            {
               message: "ok",
               data: { accessKey: objectData?.accessKey },
            },
         ],
      };
   });
