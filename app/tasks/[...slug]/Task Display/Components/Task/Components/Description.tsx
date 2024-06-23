import { TimelineEvent } from "@/app/tasks/[...slug]/Functions/Database/types";
import { Box, SxProps, Typography } from "@mui/material";

interface DescriptionProps {
    task: TimelineEvent;
}

export default function Description({ task }: DescriptionProps) {
    const sx: SxProps = {
        "&": {
            "flex": 1,
            ".text": {
                whiteSpace: "pre-wrap",
            },
        },
    };
    return (
        <Box sx={sx}>
            <Typography className="text">
                Aufgabenbeschreibung
                <br />
                {JSON.stringify(task, null, 2)}
            </Typography>
        </Box>
    );
}
