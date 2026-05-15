import { DatabaseConnection, ModelSkeleton } from "@starfield/database";
import { type ISession } from "../../typings/ISession";
import { type Model, type Schema } from "mongoose";
import mongoose from "mongoose";
import { SessionManager } from "./sessionManager";
import { randomUUIDv7 } from "bun";
import { getUnixTimeAtSecond } from "../../../utils/timingUtils";
import { lookup, type Lookup } from "geoip-lite";

export class Sessions implements ModelSkeleton {
   public schema: Schema;
   public model: Model<any>;
   public static instance: Sessions;

   constructor() {
      let database = DatabaseConnection.getSingletonTrait();

      this.schema = new mongoose.Schema<ISession>({
         sessionId: { type: String, required: true, unique: true },
         sessionOwnerId: { type: String, required: true },
         createDate: { type: Number, required: true },
         isClosed: { type: Boolean, required: true },
         IPAddress: { type: String, required: true },
         geoLocation: { type: String, required: true },
      });

      this.model = database
         .getMongooseInstance()
         .model<ISession>("session", this.schema);
      database.registerModel("session", this);
   }

   getSchema(): Schema {
      return this.schema;
   }

   getModel(): Model<any> {
      return this.model;
   }

   public static getSingletonTrait() {
      if (!Sessions.instance) {
         Sessions.instance = new Sessions();
      }

      return Sessions.instance;
   }

   async requestToCreateSession(
      sessionOwnerId: string,
      accessIpAddress: string,
   ): Promise<SessionManager> {
      let location = lookup(accessIpAddress);
      if (!location) {
         location = {
            ll: [-1, -1],
         } as Lookup;
      }
      let session = new this.model({
         sessionOwnerId,
         sessionId: randomUUIDv7(),
         createDate: getUnixTimeAtSecond(),
         isClosed: false,
         IPAddress: accessIpAddress,
         geoLocation: JSON.stringify(location.ll),
      });

      await session.save();
      return new SessionManager(session, this);
   }

   async getSessionById(sessionId: string): Promise<SessionManager | null> {
      let session = await this.model.findOne({ sessionId });
      if (session) {
         return new SessionManager(session, this);
      }
      return null;
   }
}
