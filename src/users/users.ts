import { DatabaseConnection, ModelSkeleton } from "@starfield/database";
import mongoose from "mongoose";
import type { IUserData } from "./typings/IUserData";
import { User } from "./user";
import { AuthenticationMethods } from "../authentication/typings/IAvailableAuthenticationMethod";
import { IUserRole, IUserRoles } from "./typings/IUserRoles";
import { randomUUIDv7 } from "bun";
import { getUnixTimeAtSecond } from "../utils/timingUtils";
import { schemaInitalizer } from "../configuration/schemaInitalizer";
import { BaseConfigurationSchema } from "../configuration/baseConfigurationSchema";

await DatabaseConnection.getSingletonTrait().connect();

export class Users implements ModelSkeleton {
   public schema: mongoose.Schema;
   public model: mongoose.Model<IUserData>;
   public database: DatabaseConnection;
   public static instance: Users;

   constructor() {
      schemaInitalizer();
      this.schema = new mongoose.Schema({
         userId: { type: String, required: true, unique: true },
         username: { type: String, required: true },
         displayName: { type: String, required: true },
         email: { type: String, required: true },
         preSignInSetupCompleted: { type: Boolean, default: false },
         authType: {
            type: String,
            required: true,
            enum: AuthenticationMethods,
         },
         configurationObjectId: { type: String, required: true },
         emailVerificationPassed: { type: Boolean, default: false },
         emailVerificationCode: { type: String, default: "0" },
         emailLatestRequestDate: { type: Number, default: 0 },
         hashedPassword: { type: String, required: true },
         avatar: { type: String, default: "n/a" },
         createDate: { type: Number, requried: true },
         isBanned: { type: Number, default: false },
         banPeroid: { type: Number, default: 0 },
         role: [{ type: String, enum: IUserRoles }],
      });
      this.database = DatabaseConnection.getSingletonTrait();
      this.model = this.database
         .getMongooseInstance()
         .model<IUserData>("users", this.schema);

      this.database.registerModel("users", this);
   }

   getSchema(): mongoose.Schema {
      return this.schema;
   }

   getModel(): mongoose.Model<IUserData> {
      return this.model;
   }

   public static getSingletonTrait() {
      if (!Users.instance) {
         Users.instance = new Users();
      }
      return Users.instance;
   }

   async getUserBy(
      field: keyof IUserData,
      value: string,
   ): Promise<User | null> {
      let user = await this.model.findOne({
         [field]: value,
      });
      if (user) {
         return new User(user, this);
      }
      return null;
   }

   async createUser(
      data: Pick<
         IUserData,
         "username" | "email" | "authType" | "hashedPassword" | "avatar"
      >,
   ): Promise<User | null> {
      let userId = randomUUIDv7();
      let createDate = getUnixTimeAtSecond();
      let settingsObject =
         await BaseConfigurationSchema.getSpecificSingletonTrait(
            "userSettings",
         )?.createNewRecord({});

      if (!settingsObject || settingsObject?.errors) {
         return null;
      }

      let user = new this.model({
         userId,
         createDate,
         displayName: "user",
         configurationObjectId: String(
            (settingsObject.data as any)?.[0].data.objectId || "n/a",
         ),
         role: [IUserRole],
         ...data,
      });

      await user.save();

      return new User(user, this);
   }
}
