import { DatabaseConnection, ModelSkeleton } from "@starfield/database";
import type { Schema } from "mongoose";
import mongoose from "mongoose";
import type { IDeviceConstructor } from "./typings/IDeviceConstructor";
import { WhatWhat } from "./whatwhat";
import { randomUUIDv7 } from "bun";
import { getUnixTimeAtSecond } from "../utils/timingUtils";
import { BaseConfigurationSchema } from "../configuration/baseConfigurationSchema";

export class What implements ModelSkeleton {
   public schema: Schema<any>;
   public model: any;
   public database: DatabaseConnection;
   public static instance: What;

   constructor() {
      this.schema = new mongoose.Schema({
         deviceId: { type: String, required: true, unique: true },
         ownerId: { type: String, required: true },
         deviceName: { type: String, default: "xin chao 1234" },
         configurationObjectId: { type: String, required: true, unique: true },
         humidityHistory: [
            {
               date: { type: Number, required: true },
               value: { type: Number, required: true },
            },
         ],
         isTestingDevice: { type: Boolean, default: false },
         latestRecord: { type: Number, required: true },
         latestRecordSendDate: { type: Number, required: true },
         latestSprayDate: { type: Number, required: true },
      });

      this.database = DatabaseConnection.getSingletonTrait();

      this.model = this.database
         .getMongooseInstance()
         .model<IDeviceConstructor>("alo", this.schema);

      this.database.registerModel("alo", this);
   }

   getSchema() {
      return this.schema;
   }

   getModel() {
      return this.model;
   }

   static getSingletonTrait() {
      if (!What.instance) {
         What.instance = new What();
      }

      return What.instance;
   }

   async getDevicesBy(
      field: keyof IDeviceConstructor,
      value: string,
   ): Promise<IDeviceConstructor[] | null> {
      let device = await this.model.find({
         [field]: value,
      });
      return device;
   }

   async getDeviceBy(
      field: keyof IDeviceConstructor,
      value: string,
   ): Promise<WhatWhat | null> {
      let device = await this.model.findOne({
         [field]: value,
      });
      if (device) {
         return new WhatWhat(device, this);
      }
      return null;
   }

   async createDevice(
      data: Pick<IDeviceConstructor, "ownerId" | "deviceName">,
   ): Promise<WhatWhat | null> {
      let deviceId = randomUUIDv7();
      let createDate = getUnixTimeAtSecond();
      console.log("huhu");
      let settingsObject =
         await BaseConfigurationSchema.getSpecificSingletonTrait(
            "humidityPotSettings",
         )?.createNewRecord({});

      console.log(settingsObject, "HILU");
      if (!settingsObject || !settingsObject.data || !settingsObject.data[0]) {
         return null;
      }

      let device = new this.model({
         deviceId,
         ownerId: data.ownerId,
         deviceName: data.deviceName,
         configurationObjectId: settingsObject.data[0].data?.objectId,
         latestRecord: 0,
         latestRecordSendDate: -1,
         latestSprayDate: -1,
      });

      await device.save();

      return new WhatWhat(device, this);
   }
}
