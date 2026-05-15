import type { ICountryCode } from "../../../typings/ICountryCode";
import type {
   IAuthenticationMethod,
   IOAuthProvider,
} from "./IAvailableAuthenticationMethod";

export interface IUserSignInBaseData {
   type: IAuthenticationMethod;
   data?: {};
}

export interface IUserOAuthSignInData extends IUserSignInBaseData {
   type: "oauth";
   provider: IOAuthProvider;
   data: {
      code: string;
      ipAddress: string;
   };
}

export interface IUserCredentialsSignInData extends IUserSignInBaseData {
   type: "credentials";
   data: {
      email: string;
      password: string;
   };
}

export interface IUserOAuthSignUpData extends IUserOAuthSignInData {}

export interface IUserCredentialsSignUpData extends IUserCredentialsSignInData {
   type: "credentials";
   data: {
      username: string;
      email: string;
      password: string;
      region: ICountryCode;
   };
}

export type IUserSignInData = IUserCredentialsSignInData | IUserOAuthSignInData;
export type IUserSignUpData = IUserCredentialsSignUpData | IUserOAuthSignUpData;
