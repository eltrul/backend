import { Elysia, t } from "elysia";
import { httpGateway } from "../../helpers/httpGateway/httpGateway";
import { errorSyntax } from "../../helpers/errorSyntax/errorSyntax";
import { getUnixTimeAtSecond } from "../../utils/timingUtils";
import { config } from "../../../app/config";
import { ConfigurationService } from "../../utils/logger/services";
import { BaseConfigurationSchema } from "../baseConfigurationSchema";
import { configureEditor } from "./configureEditor";
import { readObject } from "./read";

export class Http {
   public elysiaClient: Elysia;
   public static instance: Http;

   constructor() {
      this.elysiaClient = new Elysia({});
      this.elysiaClient.onError(errorSyntax);
      this.elysiaClient.onRequest(httpGateway);
      this.elysiaClient.get("/", () => {
         return getUnixTimeAtSecond();
      });
   }

   async initSchemaEndpoints(): Promise<this> {
      let availableSchemas = BaseConfigurationSchema.getAllTraits();
      for (let schemaName of availableSchemas) {
         let schema =
            BaseConfigurationSchema.getSpecificSingletonTrait(schemaName as any);

         if (!schema) {
            continue;
         }

         this.elysiaClient.post(
            schemaName + "/:objectId" + "/edit/",
            configureEditor(schema.type),
            {
               params: t.Object({
                  objectId: t.String(),
               }),
               body: t.Any(),
            },
         );

         this.elysiaClient.get(
            schemaName + "/:objectId" + "/read",
            readObject(schema.getType()),
            {
               params: t.Object({
                  objectId: t.String(),
               }),
            },
         );
      }
      return this;
   }

   listen() {
      this.elysiaClient.listen(config.services.configuration.listenPort);
      ConfigurationService.info(
         "listened on port " + config.services.configuration.listenPort,
      );
   }
}
