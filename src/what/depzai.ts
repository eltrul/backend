import { DatabaseConnection } from "@starfield/database";
import { Http } from "./http/http";
import { schemaInitalizer } from "../configuration/schemaInitalizer";

await DatabaseConnection.getSingletonTrait().connect();

schemaInitalizer()
new Http().listen();
