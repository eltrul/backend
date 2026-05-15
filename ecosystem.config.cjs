module.exports = {
  apps: [
    {
      name: "authentication",
      script: "bun",
      args: "--watch run src/authentication/authentication.ts",
      interpreter: "none"
    },
    {
      name: "users",
      script: "bun",
      args: "--watch run src/users/http.ts",
      interpreter: "none"
    },
    {
      name: "apiGateway",
      script: "bun",
      args: "--watch run src/httpGateway/httpGateway.ts",
      interpreter: "none"
    },
    {
      name: "configuration",
      script: "bun",
      args: "--watch run src/configuration/configuration.ts",
      interpreter: "none"
    },
    {
      name: "what",
      script: "bun",
      args: "--watch run src/what/depzai.ts",
      interpreter: "none"
    },
    {
      name: "pushNotification",
      script: "bun",
      args: "--watch run src/pushNotification/initalizer",
      interpreter: "none"
    }
  ]
};