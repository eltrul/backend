import { config } from "../../../../../../app/config";
import type { IDiscordOAuthResolverResponse } from "../../../../typings/IDiscordOAuthResolverResponse";
import axios from "axios";
import qs from "querystring";

export async function DiscordOAuthResolver(
   responseCode: string,
): Promise<IDiscordOAuthResolverResponse> {
   try {
      const response = await axios.post(
         "https://discord.com/api/v10/oauth2/token",
         qs.stringify({
            client_id: config.oauth.discord.appId,
            client_secret: config.oauth.discord.appSecret,
            grant_type: "authorization_code",
            code: responseCode,
            redirect_uri: config.oauth.discord.appRedirectURL,
         }),
         {
            headers: {
               "Content-Type": "application/x-www-form-urlencoded",
            },
         },
      );

      let accessToken = response.data.access_token;

      let userData = await axios.get("https://discord.com/api/users/@me", {
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
      });

      console.log(userData)

      let { id, username, global_name, avatar, email } = userData.data;

      if ([id, username, global_name, email].every((v) => v != null)) {
         console.log("IM DONE")
         return {
            data: [
               {
                  message: "OK",
                  data: {
                     username: String(username),
                     discordId: String(id),
                     avatar: String(avatar ),
                     displayName: String(global_name),
                     email: String(email),
                  },
               },
            ],
         };
      } else {
         console.log("WELP")
         return {
            errors: [
               {
                  message: "OAuth response failure.",
               },
            ],
         };
      }
   } catch (error) {
      if (axios.isAxiosError(error)) {
         return {
            errors: [
               {
                  message: error.message,
                  data: error.response?.data,
               },
            ],
         };
      }
   }

   return { errors: [{ message: "Failed to resolve data.", data: {} }] };
}
