import { Box, SxProps, Typography, TypographyProps } from "@mui/material";

type TitleProps = TypographyProps & {
    title: string;
    taskCount: number;
};
export default function Title({ title, taskCount, ...props }: TitleProps) {
    const sx: SxProps = {
        "&.Title": {
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            ".TaskCount": {
                background: "white",
                borderRadius: "10px",
                color: "black",
                padding: "5px",
            },
            "#GroupTitle": {
                margin: "0 auto",
                color: "black",
                fontSize: 18,
                // lineHeight: "130%",
                fontWeight: "bold",
            },
        },
    };
    return (
        <Box
            className="Title"
            sx={sx}
        >
            <Typography
                {...props}
                className="TaskCount"
            >
                {taskCount === 1 ? `Eine Aufgabe` : `${taskCount} Aufgaben`}
            </Typography>
            <Typography
                {...props}
                id="GroupTitle"
                className="GroupTitle"
            >
                {title}
            </Typography>
        </Box>
    );
}
