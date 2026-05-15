import Elysia from "elysia";
import { config } from "../../../../app/config";
import { AuthenticationService } from "../../../utils/logger/services";
import { oauth } from "./routes/oauth";
import { httpGateway } from "../../../helpers/httpGateway/httpGateway";
import { getUnixTimeAtSecond } from "../../../utils/timingUtils";
import { verification } from "./routes/verification";
import { errorSyntax } from "../../../helpers/errorSyntax/errorSyntax";

export class Http {
   public elysiaClient: Elysia;
   public static instance: Http;

   constructor() {
      this.elysiaClient = new Elysia({});
      this.elysiaClient.onError(errorSyntax);
      this.elysiaClient.use(oauth);
      this.elysiaClient.onRequest(httpGateway);
      this.elysiaClient.use(verification);
      this.elysiaClient.get("/", () => {
         return getUnixTimeAtSecond();
      });
   }

   listen() {
      this.elysiaClient.listen(config.services.authentication.listenPort);
      AuthenticationService.info(
         "listened on port " + config.services.authentication.listenPort,
      );
   }
}
