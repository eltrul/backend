import { Elysia } from "elysia";
import { config } from "../../../app/config";
import { UsersService } from "../../utils/logger/services";
import { errorSyntax } from "../../helpers/errorSyntax/errorSyntax";
import { httpGateway } from "../../helpers/httpGateway/httpGateway";
import { userMainRoutes } from "./routes/userMainRoutes";

export class Http {
   public elysiaClient: Elysia;

   constructor() {
      this.elysiaClient = new Elysia();
      this.elysiaClient.onError(errorSyntax);
      this.elysiaClient.onRequest(httpGateway);
      this.elysiaClient.use(userMainRoutes);
   }

   listen() {
      this.elysiaClient.listen(config.services.users.listenPort);
      UsersService.info(
         "Http service listened on port " + config.services.users.listenPort,
      );
   }
}
