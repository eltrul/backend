import type { IAuthenticationMethod } from "../../authentication/typings/IAvailableAuthenticationMethod";
import type { IUserRoles } from "./IUserRoles";

export interface IUserData {
   userId: string;
   username: string;
   displayName: string;
   email: string;
   preSignInSetupCompleted: boolean;
   authType: IAuthenticationMethod;
   configurationObjectId: string;
   emailVerificationPassed: boolean;
   emailVerificationCode: string;
   emailLatestRequestDate: number;
   hashedPassword: string;
   avatar: string;
   createDate: number;
   isBanned: boolean;
   banPeroid: number;
   role: IUserRoles[];
}
