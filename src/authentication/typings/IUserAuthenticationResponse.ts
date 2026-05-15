import type { IResponse } from "../../../typings/IResponse";
import type { IUserData } from "../../users/typings/IUserData";
import type {
   IAuthenticationMethod,
   IOAuthProvider,
} from "./IAvailableAuthenticationMethod";

export interface IUserAuthenticationResponse extends IResponse {
   data?: [
      {
         message: string;
         data: {
            type: IAuthenticationMethod;
            provider?: IOAuthProvider;
            userData: IUserData;
            grantToken: string;
         };
      },
   ];
}
