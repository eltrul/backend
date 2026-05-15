import Elysia from "elysia";
import { config } from "../../../app/config";
import { humidityController } from "./routes/humidityController";
import { httpGateway } from "../../helpers/httpGateway/httpGateway";

export class Http {
   public elysiaClient: Elysia;

   constructor() {
      this.elysiaClient = new Elysia();
      this.elysiaClient.onError(console.log)
      this.elysiaClient.onRequest(httpGateway)
      this.elysiaClient.use(humidityController);
      this.elysiaClient.get("/", () => "xin chao :D :D :D")
   }

   listen() {
      this.elysiaClient.listen(config.services.what.listenPort);
      console.log("I RUN")
   }
}
