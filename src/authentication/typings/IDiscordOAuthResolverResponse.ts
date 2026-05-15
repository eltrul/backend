import type { IResponse } from "../../../typings/IResponse";

export interface IDiscordOAuthResolverSuccessData {
   discordId: string;
   username: string;
   avatar: string;
   displayName: string;
   email: string;
}

export interface IDiscordOAuthResolverResponse {
   data?: [
      {
         message: string;
         data: IDiscordOAuthResolverSuccessData;
      },
   ];
   errors?: [{ message: string; data?: {} }];
}
