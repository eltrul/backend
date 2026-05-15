import type { IResponse } from "../../../typings/IResponse";

export interface IJWTUserGrantTokenResponse {
   type: "user_grant_token";
   userId: string;
   username: string;
   signDate: number;
   signature: string;
}

export interface IJWTResponse extends IResponse {
   data?: [
      {
         message: string;
         data: IJWTUserGrantTokenResponse;
      },
   ];
}
