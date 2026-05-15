import Elysia, { type Context } from "elysia";
import { ProxyAuthenticationHelper } from "./proxyAuthenticationHelper";

export class ProxyHandler {
   public prefix: string;
   public forwardUrl: string;
   public authenticationRequired: boolean;
   public elysiaRouter: Elysia<any>;
   public proxyAuthenticationHelper: ProxyAuthenticationHelper;

   constructor(
      prefix: string,
      forwardTo: string,
      authenticationRequired: boolean,
   ) {
      this.prefix = prefix;
      this.forwardUrl = forwardTo;
      this.authenticationRequired = authenticationRequired;
      this.elysiaRouter = new Elysia({
         prefix,
      });
      this.proxyAuthenticationHelper = new ProxyAuthenticationHelper();

      this.elysiaRouter.all("*", this.handleRequest.bind(this));
      this.elysiaRouter.get("/", this.handleRequest.bind(this));
   }

   async handleRequest({ request, path }: Context) {
      const url = new URL(request.url);
      const headers = new Headers(request.headers);
      headers.delete("host");
      headers.delete("content-length");

      const { requestId, sign } =
         await this.proxyAuthenticationHelper.createNewRequest();

      headers.set("x-starfield-req-id", requestId);
      headers.set("x-starfield-req-sign", sign);

      const target =
         this.forwardUrl +
         (path == undefined ? "/" : path.replace(this.prefix, "")) +
         url.search;
      return fetch(target, {
         method: request.method,
         headers,
         body: request.body,
      });
   }
   getRouter() {
      return this.elysiaRouter;
   }
}
