import type { IObjectType } from "../typings/IObjectTypes";
import { BaseConfigurationSchema } from "../baseConfigurationSchema";
import type { IResponse } from "../../../typings/IResponse";

export function configureEditor(schemaName: IObjectType) {
   return async (ctx: any): Promise<IResponse> => {
      let {
         set,
         headers,
         params: { objectId },
         body,
      } = ctx;

      let accessKey = headers["x-starfield-access-key"];

      if (!accessKey) {
         set.status = 400;
         throw new Error("no x-starfield-access-key header key provided.");
      }

      let schema =
         BaseConfigurationSchema.getSpecificSingletonTrait(schemaName);

      if (!schema) {
         set.status = 500;
         throw new Error("schema not found");
      }

      let updateResult = await schema.update(
         { objectId: String(objectId), objectType: schemaName },
         accessKey,
         body,
      );

      if (updateResult.errors) {
         set.status = 404;
         throw new Error(updateResult.errors[0].message || "object not found");
      }

      return {
         data: [
            {
               message: "object updated successfully",
               data: updateResult.data?.[0].data,
            },
         ],
      };
   };
}
