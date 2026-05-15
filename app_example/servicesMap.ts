import type { IProxyMap } from "../typings/IProxyMap";

export const API_GATEWAY_URL = "http://localhost:3030";

export const PROXY_MAP: IProxyMap[] = [
   // proxy mapping for apiGateway, just for testing will migrate to a better loadbalancer
   {
      serviceName: "authentication",
      prefix: "/authentication",
      endpoint: "http://localhost:3031",
   },
   {
      serviceName: "configuration",
      prefix: "/configuration",
      endpoint: "http://localhost:3032",
   },
   {
      serviceName: "users",
      prefix: "/users",
      endpoint: "http://localhost:3033",
   },
   {
      serviceName: "devices",
      prefix: "/devices",
      endpoint: "http://localhost:3034",
   },
   {
      serviceName: "pushNotification",
      prefix: "/pushNotification",
      endpoint: "http://localhost:3035",
   },
];
