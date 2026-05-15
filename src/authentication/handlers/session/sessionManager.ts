import type { Document, HydratedDocument } from "mongoose";
import type { Sessions } from "./sessions";
import type { ISession } from "../../typings/ISession";
import { JWT } from "../../JWT";

export class SessionManager {
   public currentSession: HydratedDocument<ISession>;
   private main: Sessions;
   protected JWT: JWT;

   constructor(currentSession: HydratedDocument<ISession>, main: Sessions) {
      this.currentSession = currentSession;
      this.main = main;
      this.JWT = new JWT();
   }

   isSessionClosed(): boolean {
      return this.currentSession.isClosed;
   }

   getSessionId(): string {
      return this.currentSession.sessionId;
   }

   getSessionOwnerId(): string {
      return this.currentSession.sessionOwnerId;
   }

   async closeSession(): Promise<boolean> {
      this.currentSession.isClosed = true;
      await this.currentSession.save();
      return true;
   }

   getJWTPairingToken() {
      return this.JWT.signToken(this.currentSession.toObject());
   }
}
