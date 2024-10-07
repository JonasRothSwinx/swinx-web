import { Button, SxProps } from "@mui/material";
import { sideBarButtonId } from "../config";

export interface ISideBarButton {
    id: sideBarButtonId;
    title: string;
    description: string;
    allowedGroups: string[];
    link?: string;
}
export function SideBarButton(props: {
    buttonProps: ISideBarButton;
    groups: string[];
    callback: (menu: sideBarButtonId) => unknown;
}) {
    const { id, title, description, allowedGroups } = props.buttonProps;
    const { groups, callback } = props;
    if (!allowedGroups.some((x) => groups.includes(x))) return null;
    const sx: SxProps = {
        "&.sideBarButton": {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            padding: "1rem 0.2rem",
            borderRadius: "var(--border-radius)",
            background: "rgba(var(--card-rgb), 0)",
            border: "1px solid rgba(var(--card-border-rgb), 0)",
            transition: "background 200ms, border 200ms, box-shadow 200ms",
            cursor: "pointer",
            "span:first-child": {
                display: "inline-block",
                transition: "transform 200ms",
            },
            h2: {
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                textAlign: "right",
                fontSize: "1.2em",
                fontWeight: 600,
                marginBottom: "0.7rem",
            },
            p: {
                width: "100%",
                display: "none",
                margin: 0,
                opacity: 0.6,
                fontSize: "0.9rem",
                lineHeight: 1.5,
                maxWidth: "30ch",
            },
            "&:hover p": {
                display: "block",
            },
            /* Enable hover only on non-touch devices */
            "@media (hover: hover) and (pointer: fine)": {
                "&:hover": {
                    background: "rgba(var(--card-rgb), 0.1)",
                    border: "1px solid rgba(var(--card-border-rgb), 0.15)",
                    boxShadow: "0px 4px 12px 0px #cbbeff",
                },
                "&:hover span": {
                    transform: "translateX(-4px)",
                },
                "@media (prefers-color-scheme: dark)": {
                    "&:hover": {
                        boxShadow: "none",
                    },
                },
            },
            "@media (prefers-reduced-motion)": {
                "&:hover span": {
                    transform: "none",
                },
            },
        },
    };
    return (
        <Button
            sx={sx}
            id={id.toString()}
            className={"sideBarButton"}
            onClick={() => callback(id)}
        >
            <h2>
                <span>&lt;-</span> {title}
            </h2>
            <p>{description}</p>
        </Button>
    );
}
