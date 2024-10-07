import { ArrowBack } from "@mui/icons-material";
import { Box, Icon, SxProps, Typography } from "@mui/material";
import Link from "next/link";

interface ISideBarLink {
    link: string;
    title?: string;
    description?: string;
}
export function SideBarLink({ link, title, description }: ISideBarLink) {
    const style: SxProps = {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "1rem 0.2rem",
        borderRadius: "var(--border-radius)",
        background: "rgba(var(--card-rgb), 0)",
        border: "1px solid rgba(var(--card-border-rgb), 0)",
        transition: "background 200ms, border 200ms, box-shadow 200ms",
        cursor: "pointer",
        color: "black",
        "&:hover": {
            background: "rgba(var(--card-rgb), 0.1)",
            border: "1px solid rgba(var(--card-border-rgb), 0.15)",
            boxShadow: "0px 4px 12px 0px #cbbeff",
            ".MuiIcon-root": {
                transform: "translateX(-4px)",
                "@media (prefers-reduced-motion)": {
                    transform: "none",
                },
            },
            ".title": {},
        },
        ".titleContainer": {
            display: "flex",
            flexDirection: "row",
            ".title": {
                fontSize: "1.2rem",
                fontWeight: "bold",
                wordBreak: "break-word",
                // "&:before": {
                //     content: "'<- '",
                //     marginRight: "0.5rem",
                //     display: "inline-block",
                //     transition: "transform 200ms",
                // },
            },
            ".MuiIcon-root": {
                marginRight: "0.5rem",
                display: "inline-block",
                transition: "transform 200ms",
            },
        },
    };
    return (
        <Link
            href={link}
            passHref
        >
            <Box sx={style}>
                <Box className="titleContainer">
                    <Icon>
                        <ArrowBack />
                    </Icon>
                    <Typography className="title">{title ?? link}</Typography>
                </Box>
            </Box>
        </Link>
    );
}
