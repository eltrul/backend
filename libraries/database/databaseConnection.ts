import mongoose from "mongoose";
import { config } from "../../app/config";
import type { ModelSkeleton } from "./modelSkeleton";

export class DatabaseConnection {
   protected static connection: DatabaseConnection;
   protected mongooseInstance?: mongoose.Mongoose;
   public models: Record<string, ModelSkeleton>;

   constructor() {
      this.models = {};
   }

   public static getSingletonTrait(): DatabaseConnection {
      if (!DatabaseConnection.connection) {
         DatabaseConnection.connection = new DatabaseConnection();
      }
      return DatabaseConnection.connection;
   }

   getMongooseInstance(): mongoose.Mongoose {
      return this.mongooseInstance;
   }

   isConnected(): boolean {
      return this.mongooseInstance !== undefined;
   }

   async connect(): Promise<this> {
      this.mongooseInstance = await mongoose.connect(config.mongodb.uri);
      return this;
   }

   registerModel(modelName: string, instance: ModelSkeleton): this {
      this.models[modelName] = instance;
      return this;
   }

   getModel(modelName: string): ModelSkeleton | undefined {
      return this.models[modelName];
   }
}
