import { BaseConfigurationSchema } from "../baseConfigurationSchema";
import type { IResponse } from "../../../typings/IResponse";
import type { IObjectType } from "../typings/IObjectTypes";

export function readObject(objectType: IObjectType) {
   return async (ctx: any): Promise<IResponse> => {
      let {
         set,
         headers,
         params: { objectId },
      } = ctx;

      let accessKey = headers["x-starfield-access-key"];

      if (!accessKey) {
         set.status = 400;
         throw new Error("no x-starfield-access-key header key provided.");
      }

      let schema =
         BaseConfigurationSchema.getSpecificSingletonTrait(objectType);

      if (!schema) {
         set.status = 500;
         throw new Error("schema not found");
      }

      let data = await schema.get(
         {
            objectId: String(objectId),
            objectType,
         },
         accessKey,
      );

      if (!data) {
         set.status = 404;
         throw new Error("object not found");
      }

      return {
         data: [
            {
               message: "object fetched successfully",
               data: data.data,
            },
         ],
      };
   };
}
