import Elysia from "elysia";
import { PROXY_MAP } from "../../app/servicesMap";
import { ProxyHandler } from "./proxy/proxyHandler";
import { GatewayService } from "../utils/logger/services";
import { config } from "../../app/config";
import cors from "@elysiajs/cors";

const elysiaClient = new Elysia();
elysiaClient.use(
   cors({
      credentials: true,
      origin: true,
   }),
);

elysiaClient.get("/", "Hiiiiiiii :D:D:D:D:D:D:D:D");

for (let [serviceIndex, serviceData] of Object.entries(PROXY_MAP)) {
   let proxyHandler = new ProxyHandler(
      serviceData.prefix,
      serviceData.endpoint,
      true,
   );

   elysiaClient.use(proxyHandler.getRouter());
   GatewayService.info(`Registered service ${serviceData.serviceName}`);
}

elysiaClient.listen(config.services.gateway.listenPort);
GatewayService.info("listened on port " + config.services.gateway.listenPort);
