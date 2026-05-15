import { randomUUIDv7 } from "bun";
import { Users } from "../../../../users/users";
import type { IUserOAuthSignInData } from "../../../typings/IUserAuthenticationData";
import type { IUserAuthenticationResponse } from "../../../typings/IUserAuthenticationResponse";
import { DiscordOAuthResolver } from "./resolver/discordOAuthResolver";
import { Sessions } from "../../session/sessions";
import { oauth } from "../../http/routes/oauth";

export class DiscordOAuth {
   async signIn(
      data: IUserOAuthSignInData,
   ): Promise<IUserAuthenticationResponse> {
      let callbackValidationResult = await DiscordOAuthResolver(data.data.code);
      console.log(JSON.stringify(callbackValidationResult))
      if (callbackValidationResult.errors) {
         return {
            errors: [
               {
                  message: "invalid code in request.",
               },
            ],
         };
      }
      let users = Users.getSingletonTrait();

      if (callbackValidationResult.data) {
         let oauthData = callbackValidationResult.data[0].data;
         let user = await users.getUserBy("email", oauthData.email);

         if (!user) {
            user = await users.createUser({
               username: oauthData.username,
               email: oauthData.email,
               authType: "oauth",
               hashedPassword: await Bun.password.hash(
                  oauthData.discordId + randomUUIDv7(),
               ),
               avatar: oauthData.avatar ? `https://cdn.discordapp.com/avatars/${oauthData.discordId}/${oauthData.avatar}.png` : "https://i.pinimg.com/1200x/2e/38/f5/2e38f5526c2befbf89dc4130981a97c8.jpg",
            });
         }
         if (user) {
            console.log("final", oauthData)
            if (oauthData.avatar) {
               user.userInstance.avatar = (`https://cdn.discordapp.com/avatars/${oauthData.discordId}/${oauthData.avatar}.png`)
               await user.userInstance.save()
               console.log("AVATAR CHANGED")
            }
            if (!user.isSetupProgressCompleted()) {
               await user.setupUserBaseData({
                  displayName: oauthData.displayName,
               });
            }
            return {
               data: [
                  {
                     message: "OK",
                     data: {
                        type: "oauth",
                        provider: "discord",
                        userData: user.userInstance.toObject(),
                        grantToken: (
                           await Sessions.getSingletonTrait().requestToCreateSession(
                              user.getUserId(),
                              data.data.ipAddress,
                           )
                        ).getJWTPairingToken(),
                     },
                  },
               ],
            };
         }
      }

      return {
         errors: [
            {
               message: "Failed to sign in.",
            },
         ],
      };
   }
}
