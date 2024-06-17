import { Box, Typography } from "@mui/material";
import { Campaign, ParentEvent, TimelineEvent } from "../../Functions/Database/types";
import dayjs from "@/app/utils/configuredDayJs";

interface TaskProps {
    campaign: Campaign;
    parentEvent: ParentEvent;
    task: TimelineEvent;
}
export default function Task({ campaign, parentEvent, task }: TaskProps) {
    const date = dayjs(task.date).format("DD.MM.YYYY");
    return (
        <Box>
            <Typography>
                {date}: {task.timelineEventType}
            </Typography>
        </Box>
    );
}
