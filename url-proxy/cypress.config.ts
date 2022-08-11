import { defineConfig } from "cypress";
// Populate process.env with values from .env file
require("dotenv").config();
// AWS exports
const awsConfig = require("./src/aws-exports");

export default defineConfig({
  env: {
    cognitoUsername: process.env.AWS_COGNITO_USERNAME,
    cognitoPassword: process.env.AWS_COGNITO_PASSWORD,
    cognitoUserId: process.env.AWS_COGNITO_USER_ID,
    awsConfig: awsConfig.default,
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
