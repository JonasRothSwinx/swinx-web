import { Box, SxProps } from "@mui/material";
import Image from "next/image";
import { useMemo } from "react";

//MARK: SwinxLogo
interface SwinxLogoProps {
    white?: boolean;
}
export function SwinxLogo({ white }: SwinxLogoProps) {
    return (
        <Box
            id="SwinxLogo"
            sx={{
                "&": {
                    animation: "raveMode .3s ease-in-out alternate infinite",
                    "@keyframes raveMode": {
                        "0%": {
                            filter: " hue-rotate(0deg)",
                            transform: "translateY(5px) rotate(-10deg) scaleY(0.8)",
                        },
                        "50%": {
                            filter: "hue-rotate(180deg)",
                            transform: "translateY(-10px) rotate(0deg) scaleY(1.2)",
                        },
                        "100%": {
                            filter: "hue-rotate(360deg)",

                            transform: "translateY(5px) rotate(10deg) scaleY(0.8)",
                        },
                    },
                },
            }}
        >
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
        </Box>
    );
}
