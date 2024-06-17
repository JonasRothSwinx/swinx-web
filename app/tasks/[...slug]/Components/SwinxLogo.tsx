import { Box, SxProps } from "@mui/material";
import Image from "next/image";
import { useMemo } from "react";

//MARK: SwinxLogo
interface SwinxLogoProps {
    white?: boolean;
}
export function SwinxLogo({ white }: SwinxLogoProps) {
    return (
        // <Box id="SwinxLogo" sx={style}>
        <Image
            id="SwinxLogo"
            src={white ? "/swinx-logo-white.svg" : "/swinx-logo.svg"}
            alt="Swinx Logo"
            width={200}
            height={40}
            // style={{
            //     filter: "invert(1)",
            // }}
        />
        // </Box>
    );
}
