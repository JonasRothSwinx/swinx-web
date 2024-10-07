import { defineAuth } from "@aws-amplify/backend";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const branch = process.env.AWS_BRANCH ?? "dev";
/**
 * Define and configure your auth resource
 * When used alongside data, it is automatically configured as an auth provider for data
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
    name: `swinxWebData-${branch}`,
    loginWith: {
        email: {
            verificationEmailStyle: "CODE",
            verificationEmailSubject: "Verifiziere deine Email",
            verificationEmailBody: (code: () => string) => `Dein Verifizierungscode ist ${code()}`,
        },
    },
    userAttributes: {
        givenName: {
            required: true,
            mutable: true,
        },
        familyName: {
            required: true,
            mutable: true,
        },
        profilePage: {
            required: false,
            mutable: true,
        },
        preferredUsername: {
            required: false,
            mutable: true,
        }
    },

    groups: ["admin", "projektmanager"],
});
