export type IAuthenticationMethod = "oauth" | "credentials";
export const AuthenticationMethods = ["oauth", "credentials"] as const;

export const OAuthProviders = ["discord"] as const;
export type IOAuthProvider = "discord";
