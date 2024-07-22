"use client";
import { Box, SxProps, Typography } from "@mui/material";
import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    message?: string;
}

const BoxStyle: SxProps = {
    border: "1px solid black",
    borderRadius: "10px",
    backgroundColor: "red",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    maxWidth: "100%",
    padding: "10px",
};
export function CustomErrorBoundary(props: ErrorBoundaryProps) {
    const { children } = props;
    // console.log("ErrorBoundary", props);
    return <ErrorBoundary message={props.message}>{children}</ErrorBoundary>;
}

interface Props {
    children: ReactNode;
    message?: string;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public data: { error: Error | undefined; errorInfo: ErrorInfo | undefined } = {
        error: undefined,
        errorInfo: undefined,
    };

    public static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.data = { error, errorInfo };
        console.log("ErrorBoundary", error, errorInfo);
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <Box sx={BoxStyle}>
                    <Typography>{this.props.message ?? "In diesem Element is ein Fehler aufgetreten"}</Typography>
                    <Typography> Bitte laden Sie die Seite neu</Typography>
                    {/* <Typography>
                        {JSON.stringify({ error: this.data.error, errorInfo: this.data.errorInfo })}
                    </Typography> */}
                </Box>
            );
        }

        return this.props.children;
    }
}
