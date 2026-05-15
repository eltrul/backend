export const config = {
   mongodb: {
      uri: "mongodb authentication uri",
   },

   redis: {
      uri: "redis authentication uri",
   },

   brevo: {
      user: "", // automation email sending service, take one in https://bravo.com/
      password: "",
   },

   oauth: {
      discord: {
         appId: "",
         appSecret: "",
         appRedirectURL: "",
         authenticateURL: "", // discord oauth2 credentials
      },
   },

   services: {
      gateway: {
         listenPort: 3030,
      },
      authentication: {
         listenPort: 3031,
      },
      configuration: {
         listenPort: 3032,
      },
      users: {
         listenPort: 3033,
      },
      what: {
         listenPort: 3034,
      },
      PushNotification: {
         listenPort: 3035,
      },
   },
};
