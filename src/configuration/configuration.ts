import { DatabaseConnection } from "@starfield/database";
import { Http } from "./http/http";
import { schemaInitalizer } from "./schemaInitalizer";

await DatabaseConnection.getSingletonTrait().connect();
schemaInitalizer();

let httpClient = new Http();
await httpClient.initSchemaEndpoints();
httpClient.listen();
