"use client";
import { Authenticator, useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { ThemeProvider } from "@emotion/react";

import { createTheme } from "@mui/material";
import { blue } from "@mui/material/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ConfirmProvider, ConfirmProviderProps } from "material-ui-confirm";
import { dataClient } from "@dataClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CampaignDetails from "./CampaignDetails";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            // staleTime: Infinity,
            retry: true,
        },
    },
});
dataClient.config.setQueryClient(queryClient);

const confirmProviderProps: Omit<ConfirmProviderProps, "children"> = {
    defaultOptions: {
        confirmationText: "Ok",
        cancellationText: "Abbrechen",
        title: "Bestätigung",
        contentProps: {
            sx: {
                "&": {
                    ".MuiTypography-root": {
                        whiteSpace: "pre-wrap",
                    },
                },
            },
        },
    },
};
interface CampaignProps {
    campaignId: string;
}
function Campaign({ params, params: { campaignId } }: { params: CampaignProps }) {
    console.log("Campaign", params);
    const { user, authStatus } = useAuthenticator((context) => [context.user, context.authStatus]);
    return (
        <Authenticator.Provider>
            <ConfirmProvider {...confirmProviderProps}>
                <QueryClientProvider client={queryClient}>
                    {authStatus === "authenticated" && <CampaignDetails campaignId={campaignId} />}
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </ConfirmProvider>
        </Authenticator.Provider>
    );
}
export default withAuthenticator(Campaign);
