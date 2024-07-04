"use client";

import { Box, SxProps, Typography } from "@mui/material";
import Content from "./Content";

export default function FollowerAnalysis() {
    const styles: SxProps = {
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        alignItems: "center",
        flex: "1",
        overflow: "hidden",

        backgroundColor: "var(--backgroundColor)",
        margin: "10px",
        width: "auto", // "100%
        height: "auto",
        borderRadius: "20px",
        border: "1px solid black",
        "#Title": {
            width: "100%",
            textAlign: "center",
            padding: "5px",
            color: "white",
            backgroundColor: "var(--swinx-blue)",
        },
    };
    return (
        <Box id="FollowerAnalysis" sx={styles}>
            <Title />
            <Content />
        </Box>
    );
}

function Title() {
    return (
        <Box id="Title">
            <Typography variant="h1">Follower Analysis</Typography>
        </Box>
    );
}
