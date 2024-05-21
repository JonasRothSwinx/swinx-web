import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * When used alongside data, it is automatically configured as an auth provider for data
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
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
        },
    },

    groups: ["admin", "projektmanager"],
});
