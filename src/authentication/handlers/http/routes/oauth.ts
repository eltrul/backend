import { Elysia, t } from "elysia";
import { OAuthProviders } from "../../../typings/IAvailableAuthenticationMethod";
import { OAuthAuthentication } from "../../baseAuthentication/OAuthAuthentication";
import { config } from "../../../../../app/config";

const OAuthTypeEnum = Object.fromEntries(
   OAuthProviders.map((v) => [v, v]),
) as Record<(typeof OAuthProviders)[number], (typeof OAuthProviders)[number]>;

export const oauth = new Elysia({ prefix: "/oauth" })
   .get(
      "/:oauthType/start",
      ({ params }) => {
         return {
            data: {
               message: "OK",
               data: {
                  redirectURI: config.oauth[params.oauthType].authenticateURL,
               },
            },
         };
      },
      {
         params: t.Object({
            oauthType: t.Enum(OAuthTypeEnum),
         }),
      },
   )
   .get(
      "/:oauthType/callback",
      async ({ params, query, set }) => {
         let { code } = query;
         let oauth = new OAuthAuthentication(
            params.oauthType,
         ).getAuthenticationController();
         let signResult = await oauth.signIn({
            type: "oauth",
            provider: params.oauthType,
            data: {
               ipAddress: "1.1.1.1",
               code,
            },
         });

         if (signResult.errors) {
            set.status = 400;
            return signResult;
         }

         if (signResult.data) {
            return signResult;
         }
      },
      {
         params: t.Object({
            oauthType: t.Enum(OAuthTypeEnum),
         }),
         query: t.Object({
            code: t.String(),
         }),
      },
   )
   .get("/", () => "OK");
