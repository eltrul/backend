import { BaseConfigurationSchema } from "./baseConfigurationSchema";
import {
   sprayMode,
   type IHumidityPotSettings,
} from "./typings/IHumidityPotSettings";
import type { IUserSettings } from "./typings/IUserSettings";

export function schemaInitalizer() {
   new BaseConfigurationSchema<IUserSettings>("userSettings", "userSettings", {
      theme: {
         type: String,
         default: "dark",
         enum: ["light", "dark"],
      },
   });

   new BaseConfigurationSchema<IHumidityPotSettings>(
      "humidityPotSettings",
      "humidityPotSettings",
      {
         sprayMode: {
            type: String,
            default: "humidity",
            enums: sprayMode,
         },
         sprayInterval: {
            type: Number,
            default: 60 * 30,
            min: 60,
            max: 60 * 60 * 60,
         },
         sprayThresehold: {
            type: Number,
            default: 40,
            min: 5,
            max: 100,
         },
      },
   );
}
