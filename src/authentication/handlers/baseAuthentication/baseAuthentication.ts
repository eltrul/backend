import {
   type ISignInAdapter,
   type ISignUpAdapter,
} from "../../typings/IUserAuthenticationAdapter";
import { OAuthAuthentication } from "./OAuthAuthentication";

export class BaseAuthentication {
   private authenticationAdapters: {
      signInAdapters: ISignInAdapter[];
      signUpAdapters: ISignUpAdapter[];
   };

   constructor() {
      this.authenticationAdapters = {
         signInAdapters: [],
         signUpAdapters: [],
      };
   }

   registerAdapter(
      adapterType: "signInAdapters" | "signUpAdapters",
      name: string,
      callback: Function,
   ): this {
      this.authenticationAdapters[adapterType].push({ name, callback });
      return this;
   }

   emitAdapter(adapterType: "signInAdapters" | "signUpAdapters", data: any) {
      for (let adapterData of this.authenticationAdapters[adapterType]) {
         adapterData.callback(data);
      }
   }
}
