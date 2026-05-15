import { DatabaseConnection, ModelSkeleton } from "@starfield/database";
import mongoose from "mongoose";
import { deviceTypes } from "src/devices/typings/devices/IBaseDevice";

export class DevicesManager<T> implements ModelSkeleton {
   public schema: mongoose.Schema;
   public model: mongoose.Model<T>;
   public database: DatabaseConnection;
   constructor() {
      this.schema = new mongoose.Schema({
         deviceId: { type: String, required: true, unique: true },
         deviceName: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 30,
         },
         deviceType: { type: String, required: true, enum: IDevice },
      });
      this.database = DatabaseConnection.getSingletonTrait();
      this.model = this.database
         .getMongooseInstance()
         .model<T>("devices", this.schema);

      this.database.registerModel("devices", this);
   }

   getSchema(): mongoose.Schema {
      return this.schema;
   }

   getModel(): mongoose.Model<T> {
      return this.model;
   }
}
