import type { HydratedDocument } from "mongoose";
import type {
   IDeviceConstructor,
   IHumidityRecord,
} from "./typings/IDeviceConstructor";
import { getUnixTimeAtSecond } from "../utils/timingUtils";
import type { IResponse } from "../../typings/IResponse";


export class WhatWhat {
   public instance: HydratedDocument<IDeviceConstructor>;

   constructor(instance: HydratedDocument<IDeviceConstructor>, main: any) {
      this.instance = instance;
   }

   getHumidityRecords(): IResponse<IHumidityRecord[]> {
      return {
         data: [
            {
               message: "success",
               data: this.instance.humidityHistory,
            },
         ],
      };
   }

   async addHumidityRecord(data: IHumidityRecord): Promise<IResponse> {
      if (this.instance.humidityHistory.length > 20) {
         this.instance.humidityHistory.shift();
      }

      this.instance.humidityHistory.push(data);
      this.instance.latestRecord = data.value;
      this.instance.latestRecordSendDate = getUnixTimeAtSecond();

      await this.instance.save();

      return {
         data: [
            {
               message: "success",
            },
         ],
      };
   }

   
   async updateLatestSprayDate(): Promise<IResponse> {
      this.instance.latestSprayDate = getUnixTimeAtSecond();

      await this.instance.save();

      return {
         data: [
            {
               message: "success",
            },
         ],
      };
   }

   getDeviceName(): string {
      return this.instance.deviceName;
   }

   async setDeviceName(name: string): Promise<IResponse> {
      this.instance.deviceName = name;
      await this.instance.save();
      return {
         data: [
            {
               message: "success",
            },
         ],
      };
   }

   getLatestRecord(): number {
      return this.instance.latestRecord;
   }
}
