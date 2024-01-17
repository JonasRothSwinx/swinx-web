"use client";
import { Authenticator, useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import WelcomePage from "./Pages/WelcomePage/WelcomePage";

// Amplify.configure(config, { ssr: true });

function Home() {
    const { user, authStatus } = useAuthenticator((context) => [context.user, context.authStatus]);
    return (
        <Authenticator.Provider>
            {" "}
            <>{authStatus === "authenticated" && <WelcomePage />}</>
        </Authenticator.Provider>
    );
}
export default withAuthenticator(Home);
