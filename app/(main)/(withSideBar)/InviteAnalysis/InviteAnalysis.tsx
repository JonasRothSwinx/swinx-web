import { Box, Button, SxProps, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { s3 } from "./serverActions";
import { GetObjectCommandOutput, ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { FileList } from "./FileList";
import { FileDetails } from "./FileDetails/FileDetails";

export function InviteAnalysis() {
    const sx: SxProps = {
        flex: 1,
        overflow: "hidden",
        maxHeight: "100%",
        display: "flex",
        flexDirection: "row",
        height: "100%",
        width: "100%",
        backgroundColor: "#c0c0c0",
    };
    return (
        <Box sx={sx}>
            <FileList />
            <FileDetails />
        </Box>
    );
}
