import { Elysia, type Context } from "elysia";
import type { IResponse } from "../../../typings/IResponse";
import { JWT } from "../../authentication/JWT";
import { Sessions } from "../../authentication/handlers/session/sessions";
import type { ISession } from "../../authentication/typings/ISession";
import type { SessionManager } from "../../authentication/handlers/session/sessionManager";

export interface ISessionVerificationContext extends Context {
   session: {
      tokenData: ISession;
      controller: SessionManager;
   };
}


export const httpSessionVerificationMiddleware = (settings?: {
   shouldUseGatewayVerificationMiddleware?: boolean;
}) => {
   let instance = new Elysia();

   return instance.derive({ as: "global" }, async ({ headers, set }) => {
      const sessionToken = headers["x-starfield-session"];

      if (!sessionToken) {
         set.status = 400;
         throw new Error("no x-starfield-session header key provided.");
      }

      const jwt = new JWT();
      const verifyResult = jwt.parseGrantToken(sessionToken);

      if (verifyResult.errors) {
         set.status = 400;
         throw new Error("invalid token");
      }

      const tokenData = verifyResult.data![0].data as ISession;

      const session = await Sessions.getSingletonTrait().getSessionById(
         tokenData.sessionId,
      );

      if (!session) {
         set.status = 401;
         throw new Error("invalid session");
      }

      if (session.isSessionClosed()) {
         set.status = 401;
         throw new Error("session is closed");
      }

      return {
         session: {
            tokenData,
            controller: session,
         },
      };
   });
};
