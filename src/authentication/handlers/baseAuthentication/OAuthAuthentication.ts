import type { IOAuthProvider } from "../../typings/IAvailableAuthenticationMethod";
import { BaseAuthentication } from "./baseAuthentication";
import { DiscordOAuth } from "./OAuth/discordOAuth";

export class OAuthAuthentication extends BaseAuthentication {
   public type: IOAuthProvider;
   constructor(type: IOAuthProvider) {
      super();
      this.type = type;
   }

   getAuthenticationController(): DiscordOAuth {
      switch (this.type) {
         case "discord":
            return new DiscordOAuth();
            break;
      }
   }
}
