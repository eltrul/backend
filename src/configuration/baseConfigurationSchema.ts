import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";
import { objectTypes, type IObjectType } from "./typings/IObjectTypes";
import { DatabaseConnection, ModelSkeleton } from "@starfield/database";
import type { IResponse } from "../../typings/IResponse";
import type { IConfigurationObjectBaseData } from "./typings/IConfigurationObjectBaseData";
import { randomUUIDv7 } from "bun";

export class BaseConfigurationSchema<T> implements ModelSkeleton {
   public name: string;
   public type: IObjectType;
   public schema: Schema;
   public model: Model<any>;
   public static instances: Record<string, BaseConfigurationSchema<any>> = {};

   constructor(
      name: string,
      type: IObjectType,
      dataSchema: Record<keyof T, any>,
   ) {
      this.name = name;
      this.type = type;

      let database = DatabaseConnection.getSingletonTrait();
      this.schema = new mongoose.Schema<IConfigurationObjectBaseData<T>>({
         objectId: { type: String, required: true },
         objectType: { type: String, required: true, enum: objectTypes },
         accessKey: { type: String, required: true },
         data: dataSchema,
      });

      this.model = database
         .getMongooseInstance()
         .model<IConfigurationObjectBaseData<T>>(name, this.schema);
      database.registerModel(name + "Configuration", this);
      BaseConfigurationSchema.instances[name] = this;
   }

   static getSpecificSingletonTrait(traitName: IObjectType) {
      let instance = BaseConfigurationSchema.instances[traitName];
      if (!instance) {
         return null;
      }
      return instance;
   }

   static getAllTraits() {
      return Object.keys(BaseConfigurationSchema.instances);
   }

   getSchema(): Schema {
      return this.schema;
   }

   getModel(): Model<any> {
      return this.model;
   }

   getName() {
      return this.name;
   }

   getType() {
      return this.type;
   }

   async createNewRecord(
      data: T,
   ): Promise<IResponse<{ objectId: string; accessKey: string }>> {
      let objectId = randomUUIDv7().toString();
      let accessKey = await Bun.password.hash(randomUUIDv7().toString());
      let record = new this.model({
         objectId,
         objectType: this.type,
         accessKey,
         data,
      });

      await record.save();

      return {
         data: [
            {
               message: "record created.",
               data: {
                  objectId,
                  accessKey,
               },
            },
         ],
      };
   }

   async update(
      filter: IConfigurationObjectBaseData<T>,
      secretKey: string,
      data: Record<keyof T, any>,
   ): Promise<IResponse> {
      filter.accessKey = secretKey;

      let doc = await this.model.findOne(filter);
      if (!doc) {
         return {
            errors: [{ message: "query failed." }],
         };
      }

      doc.set({
         accessKey: await Bun.password.hash(randomUUIDv7().toString()),
         data,
      });

      let validationError = doc.validateSync();
      if (validationError) {
         return {
            errors: [{ message: validationError.message }],
         };
      }

      await doc.save();

      return {
         data: [
            {
               message: "change saved.",
               data: { finalData: data, accessKey: doc.accessKey },
            },
         ],
      };
   }

   async get(
      filter: IConfigurationObjectBaseData<T>,
      accessKey: string,
   ): Promise<HydratedDocument<T> | null> {
      filter.accessKey = accessKey;
      let data = await this.model.findOne(filter);

      return data;
   }

   async getObject(
      objectId: string,
   ): Promise<HydratedDocument<any> | undefined> {
      return await this.model.findOne({ objectId });
   }
}
