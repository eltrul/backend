import { DatabaseConnection } from "@starfield/database";
import { config } from "../../app/config";
import { AuthenticationService } from "../utils/logger/services";
import { Http } from "./handlers/http/http";

await DatabaseConnection.getSingletonTrait().connect();

let http = new Http();
http.listen();
