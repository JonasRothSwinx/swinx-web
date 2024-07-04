import { Typography, TypographyProps } from "@mui/material";

type TitleProps = TypographyProps & {
    title: string;
    taskCount: number;
};
export default function Title({ title, taskCount, ...props }: TitleProps) {
    return (
        <Typography {...props}>
            {title} {taskCount === 1 ? `(Eine Aufgabe)` : `(${taskCount} Aufgaben)`}
        </Typography>
    );
}
