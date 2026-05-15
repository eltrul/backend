import { DatabaseConnection, ModelSkeleton } from "@starfield/database";
import mongoose from "mongoose"
import { type IPushNotificationRecord } from "./typings/IPushNotificationRecord";
import { Controller } from "./controller";
import { randomUUIDv7 } from "bun";
import { FirebaseControl } from "./firebaseControl";
import type { Messaging } from "firebase-admin/messaging";

export class PushNotification implements ModelSkeleton {
   public schema: mongoose.Schema<IPushNotificationRecord>;
    public model: mongoose.Model<IPushNotificationRecord>;
    public database: DatabaseConnection;
    public firebase: Messaging
    public static instance: PushNotification;

   constructor() {
      this.schema = new mongoose.Schema({
         deviceId: { type: String, required: true, unique: true }, 
         ownerId: { type: String, required: true }, 
         state: { type: String, required: true, enum: ["active", "disabled"] },
         deviceName: { type: String, required: true }, 
         secret: { type: String, required: true, unique: true }
      });

      this.database = DatabaseConnection.getSingletonTrait();

      this.model = this.database
         .getMongooseInstance()
         .model<IPushNotificationRecord>("pushNotification", this.schema);

      this.database.registerModel("alo", this);

      
      this.firebase = FirebaseControl.getInstance().getMessagingControl()
   }

   getSchema() {
      return this.schema;
   }

   getModel() {
      return this.model;
   }

   static getSingletonTrait() {
      if (!PushNotification.instance) {
         PushNotification.instance = new PushNotification();
      }

      return PushNotification.instance;
   }

   async createNewRecord(ownerId: string, deviceName: string, secret: string) { 
      let record = new this.model({
         deviceId: randomUUIDv7(),
         ownerId, 
         deviceName,
         secret, 
         state: "active"
      })
      console.log("CREATING....", await this.model.findOne({
         secret
      }))
      await record.save() 
      console.log("CREATED", record)
      return {
         data: [{
            message: "registered."
         }]
      }
   }

   async getPairedDevices(ownerId: string, pureData?: boolean) {
      const devices = await this.model.find({ ownerId }).lean();
      
      if (pureData) return devices

      return devices.map(({ secret, ...rest }) => rest);
   }

   async getController(deviceId: string) {
      let instance = await this.model.findOne({
         deviceId
      })

      if (instance){ 
         return new Controller(instance, this)
      }
   }
   async broadcastMessage(ownerId: string, title: string, body: string) {
      const devices = await this.model.find({ ownerId, state: "active" }).lean();
      const tokens = devices.map(d => d.secret).filter(Boolean);

      if (!tokens.length) return;

      const chunkSize = 500;

      for (let i = 0; i < tokens.length; i += chunkSize) {
         const chunk = tokens.slice(i, i + chunkSize);

         try {
            const res = await this.firebase.sendEachForMulticast({
               tokens: chunk,
               notification: { title, body },
            });

            console.log("RES", res)
            res.responses.forEach(async (r, idx) => {
               if (!r.success) {
                  const token = chunk[idx];
                  await this.model.deleteOne({ secret: token });
               }
            });
         } catch (err) {
            console.error(err);
         }
      }
   }
} 