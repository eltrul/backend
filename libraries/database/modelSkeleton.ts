import type { DatabaseConnection } from "./databaseConnection";

export abstract class ModelSkeleton {
   abstract schema: any;
   abstract model: any;
   abstract database: DatabaseConnection;

   abstract getSchema(): any;
   abstract getModel(): any;
}
