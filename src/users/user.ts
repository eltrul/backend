import type { HydratedDocument } from "mongoose";
import type { IUserData } from "./typings/IUserData";
import type { Users } from "./users";
import { getUnixTimeAtSecond } from "../utils/timingUtils";
import type { IUserBanState } from "./typings/IUserBanState";
import { IDeveloperRole, IUserRoles } from "./typings/IUserRoles";
import type { IAuthenticationMethod } from "../authentication/typings/IAvailableAuthenticationMethod";
import type { IResponse } from "../../typings/IResponse";
import { VerificationCode } from "@starfield/mailer";
import cryptoRandomString from "crypto-random-string";

export class User {
   public userInstance: HydratedDocument<IUserData>;
   public main: Users;

   constructor(userInstance: HydratedDocument<IUserData>, main: Users) {
      this.userInstance = userInstance;
      this.main = main;
   }

   async modifyKey(
      key: keyof IUserData,
      value: IUserData[keyof IUserData],
   ): Promise<IResponse> {
      let blockedKeys: (keyof IUserData)[] = [
         "userId",
         "authType",
         "hashedPassword",
      ];

      if (
         !this.canUserAppearenceModifiable() ||
         blockedKeys.find((blockedKey) => blockedKey == key)
      ) {
         return {
            errors: [
               {
                  message: "This key is not modifiable.",
               },
            ],
         };
      }

      (this.userInstance as any)[key] = value;
      await this.userInstance.save();

      return {
         data: [
            {
               message: "OK",
            },
         ],
      };
   }

   getUserId(): string {
      return this.userInstance.userId;
   }

   getUsername(): string {
      return this.userInstance.username;
   }

   async changeUsername(username: string): Promise<IResponse> {
      return await this.modifyKey("username", username);
   }

   async changeDisplayName(displayName: string): Promise<IResponse> {
      return await this.modifyKey("displayName", displayName);
   }

   getUserEmail(): string {
      return this.userInstance.email;
   }

   isSetupProgressCompleted(): boolean {
      return this.userInstance.preSignInSetupCompleted;
   }

   async setupUserBaseData(
      data: Pick<IUserData, "displayName">,
   ): Promise<IResponse> {
      this.userInstance.displayName = data.displayName;
      this.userInstance.preSignInSetupCompleted = true;
      await this.userInstance.save();

      return {
         data: [
            {
               message: "OK",
            },
         ],
      };
   }

   getUserHashedPassword(): string {
      return this.userInstance.hashedPassword;
   }

   async changePassword(password: string): Promise<IResponse> {
      return await this.modifyKey(
         "hashedPassword",
         await Bun.password.hash(password),
      );
   }

   getUserAuthenticationMethod(): IAuthenticationMethod {
      return this.userInstance.authType;
   }

   async getUserBanState(): Promise<IUserBanState> {
      let isBanned = this.userInstance.isBanned;
      let banExpiryDate = getUnixTimeAtSecond() - this.userInstance.banPeroid;

      if (isBanned) {
         if (banExpiryDate <= 0) {
            this.userInstance.isBanned = false;
            await this.userInstance.save();
            return this.getUserBanState();
         }
      }

      return {
         isBanned,
         banExpiryDate,
      };
   }

   doesUserIncludeRole(roleId: IUserRoles): boolean {
      return this.userInstance.role.find((role) => role == roleId) != undefined;
   }

   async editRole(
      type: "add" | "remove",
      roleId: IUserRoles,
   ): Promise<IResponse> {
      if (type == "add" && !this.doesUserIncludeRole(roleId)) {
         this.userInstance.role.push(roleId);
         await this.userInstance.save();
      }

      if (type == "remove" && this.doesUserIncludeRole(roleId)) {
         this.userInstance.role = this.userInstance.role.filter(
            (role) => role != roleId,
         );
         await this.userInstance.save();
      }

      return {
         data: [
            {
               message: "OK",
            },
         ],
      };
   }

   isAdministrator(): boolean {
      return this.doesUserIncludeRole(IDeveloperRole);
   }

   canUserAppearenceModifiable() {
      return this.getUserAuthenticationMethod() != "oauth";
   }

   async changeAvatar(avatar: string): Promise<IResponse> {
      return await this.modifyKey("avatar", avatar);
   }

   isEmailVerified() {
      return this.userInstance.emailVerificationPassed;
   }

   canRequestEmailVerificationCode() {
      return (
         getUnixTimeAtSecond() - this.userInstance.emailLatestRequestDate > 55
      );
   }

   async requestEmailVerificationCode(): Promise<IResponse> {
      if (this.isEmailVerified()) {
         return {
            errors: [
               {
                  message: "email is verified.",
               },
            ],
         };
      }

      if (!this.canRequestEmailVerificationCode()) {
         return {
            errors: [
               {
                  message: "Rare limit reached.",
               },
            ],
         };
      }

      let nextCode = cryptoRandomString({
         length: 8,
      });
      this.userInstance.emailLatestRequestDate = getUnixTimeAtSecond();
      this.userInstance.emailVerificationCode = new Bun.CryptoHasher("sha256")
         .update(String(nextCode))
         .digest("hex");

      let verificationEmail = new VerificationCode({
         username: this.userInstance.username,
         verificationCode: String(nextCode),
      });
      await this.userInstance.save();
      await verificationEmail.sendTo(this.userInstance.email);

      return {
         data: [
            {
               message: "email sent.",
            },
         ],
      };
   }

   async verifyEmail(code: string): Promise<IResponse> {
      if (this.isEmailVerified()) {
         return {
            errors: [
               {
                  message: "email is verified.",
               },
            ],
         };
      }
      if (
         new Bun.CryptoHasher("sha256").update(String(code)).digest("hex") ==
         this.userInstance.emailVerificationCode
      ) {
         this.userInstance.emailVerificationPassed = true;
         await this.userInstance.save();
         return {
            data: [
               {
                  message: "email verified.",
               },
            ],
         };
      }

      return {
         errors: [
            {
               message: "verify code is invaild.",
            },
         ],
      };
   }

   async banUser(days: number): Promise<IResponse> {
      this.userInstance.isBanned = true;
      this.userInstance.banPeroid = getUnixTimeAtSecond() + days * 86400;
      await this.userInstance.save();

      return {
         data: [
            {
               message: "OK",
               data: {
                  expiryDate: this.userInstance.banPeroid,
               },
            },
         ],
      };
   }

   async unbanUser(): Promise<IResponse> {
      this.userInstance.isBanned = false;
      await this.userInstance.save();

      return {
         data: [
            {
               message: "OK",
            },
         ],
      };
   }

   getUserConfigureObjectId() {
      return this.userInstance.configurationObjectId;
   }
}
