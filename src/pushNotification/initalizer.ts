import { DatabaseConnection } from "@starfield/database";
import { Http } from "./http/http";

await DatabaseConnection.getSingletonTrait().connect();

(new Http()).listen()