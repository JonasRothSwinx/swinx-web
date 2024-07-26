"use client";

import { Box, SxProps, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { blue } from "@mui/material/colors";
import { dataClient } from "@/app/ServerFunctions/database";
import TasksLanding from "./TasksLanding";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import styles from "./styles";
// import Head from "next/head";
// import { Metadata } from "next";
import { ConfirmProvider, ConfirmProviderProps } from "material-ui-confirm";
import "@aws-amplify/ui-react/styles.css";

const queryClient = new QueryClient();
dataClient.config.setQueryClient(queryClient);
const theme = createTheme({
    palette: {
        primary: {
            main: "#2867b2",
        },
        // secondary: { main: "#ffffff" },W
    },
    shape: { borderRadius: 20 },
});

const confirmOptions: ConfirmProviderProps["defaultOptions"] = {
    confirmationText: "Ok",
    cancellationText: "Abbrechen",
    title: "Bestätigung",
};

export default function Page({ params }: { params: { slug: string[] } }) {
    // console.log("Page", params);
    const [campaignId, assignmentId, influencerId, openedEvent] = params.slug;
    const sx: SxProps = {
        "&": {
            "--background-color": "white",
            position: "relative",
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            // padding: "20px",
            overflow: "hidden",

            "#TempMessageBox": {
                height: "fit-content",
                backgroundColor: "var(--background-color)",
                margin: "10px",
                marginBlock: "auto",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid black",
                textAlign: "center",
            },
            // filter: "sepia(100%)",
            // animation: "raveMode .3s ease-in-out alternate infinite",
            // "@keyframes raveMode": {
            //     "0%": {
            //         filter: "sepia(100%) hue-rotate(0deg)",
            //         transform: "translateY(20px) rotate(-10deg) scaleY(0.8)",
            //     },
            //     "50%": {
            //         filter: "sepia(100%) hue-rotate(180deg)",
            //         transform: "translateY(-100px) rotate(0deg) scaleY(1.2)",
            //     },
            //     "100%": {
            //         filter: "sepia(100%) hue-rotate(360deg)",

            //         transform: "translateY(20px) rotate(10deg) scaleY(0.8)",
            //     },
            // },
        },
    };
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <ConfirmProvider defaultOptions={confirmOptions}>
                    <Box
                        id="TasksLandingPage"
                        sx={sx}
                    >
                        <TasksLanding
                            assignmentId={assignmentId}
                            campaignId={campaignId}
                            influencerId={influencerId}
                            openedEvent={openedEvent}
                        />
                        <ReactQueryDevtools initialIsOpen={false} />
                    </Box>
                </ConfirmProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
