import Elysia from "elysia";
import { config } from "../../../app/config";
import { httpGateway } from "../../helpers/httpGateway/httpGateway";
import { errorSyntax } from "../../helpers/errorSyntax/errorSyntax";
import { pushNotificationRoute } from "./routes";

export class Http {
   public elysiaClient: Elysia;

   constructor() {
      this.elysiaClient = new Elysia();
      this.elysiaClient.onError(console.log)
      this.elysiaClient.onRequest(httpGateway)
      this.elysiaClient.use(pushNotificationRoute);
      this.elysiaClient.get("/", () => "xin chao :D :D :D")
   }

   listen() {
      this.elysiaClient.listen(config.services.PushNotification.listenPort);
      console.log("I RUN")
   }
}
