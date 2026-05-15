import type { IAuthenticationMethod } from "../../authentication/typings/IAvailableAuthenticationMethod";

export interface ICreateUserData {
   userId: string;
   username: string;
   displayName: string;
   email: string;
   preSignInSetupCompleted: boolean;
   authType: IAuthenticationMethod;
   hashedPassword: string;
   avatar: string;
}
