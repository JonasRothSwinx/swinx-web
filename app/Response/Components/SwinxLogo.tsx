import { Box, SxProps } from "@mui/material";
import Image from "next/image";
import { useMemo } from "react";

//MARK: SwinxLogo
export function SwinxLogo() {
    return (
        // <Box id="SwinxLogo" sx={style}>
        <Image id="SwinxLogo" src="/swinx-logo.svg" alt="Swinx Logo" width={200} height={40} />
        // </Box>
    );
}
