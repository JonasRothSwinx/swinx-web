import { Box, Table, TableBody, TableRow, TableCell, SxProps, Typography } from "@mui/material";
import { Task, TimelineEvent } from "../../Functions/Database/types";
import { dayjs, type Dayjs } from "@/app/utils";

interface TaskSummaryProps {
    events: TimelineEvent[];
}
type TaskSummaryDetails = {
    totalInvites?: number;
    totalTextPosts?: number;
    totalVideoPosts?: number;
    totalVideos?: number;
    speakerDate?: Dayjs;
};

export function TaskSummary({ events }: TaskSummaryProps) {
    const summaryDetails: TaskSummaryDetails = {};
    events.reduce((acc, event) => {
        const eventType = event.timelineEventType;
        switch (eventType) {
            case "WebinarSpeaker": {
                acc.speakerDate = dayjs(event.date);
                break;
            }
            case "Invites": {
                const inviteAmount = event.eventTaskAmount || 0;
                acc.totalInvites = (acc.totalInvites || 0) + inviteAmount;
                break;
            }
            case "Post": {
                acc.totalTextPosts = (acc.totalTextPosts || 0) + 1;
                break;
            }
            case "Video": {
                acc.totalVideoPosts = (acc.totalVideoPosts || 0) + 1;
                break;
            }
            case "ImpulsVideo": {
                acc.totalVideos = (acc.totalVideos || 0) + 1;
                break;
            }
        }
        return acc;
    }, summaryDetails);
    const sx: SxProps = {
        "&": {},
    };
    return (
        <Box sx={sx} className="SummaryTable">
            <Typography className="SummaryTableTitle">Leistungsübersicht</Typography>
            <Table>
                <TableBody>
                    {/* <TableRow>
                        <TableCell>Leistungsübersicht</TableCell>
                    </TableRow> */}
                    {summaryDetails.totalInvites && (
                        <TableRow>
                            <TableCell>Einladungen</TableCell>
                            <TableCell>{summaryDetails.totalInvites}</TableCell>
                        </TableRow>
                    )}
                    {summaryDetails.totalTextPosts && (
                        <TableRow>
                            <TableCell>Textbeiträge</TableCell>
                            <TableCell>
                                {summaryDetails.totalTextPosts}{" "}
                                {summaryDetails.totalTextPosts === 1 ? `Beitrag` : "Beiträge"}
                            </TableCell>
                        </TableRow>
                    )}
                    {summaryDetails.totalVideoPosts && (
                        <TableRow>
                            <TableCell>Videobeiträge</TableCell>
                            <TableCell>
                                {summaryDetails.totalVideoPosts}{" "}
                                {summaryDetails.totalVideoPosts === 1 ? `Beitrag` : "Beiträge"}
                            </TableCell>
                        </TableRow>
                    )}
                    {summaryDetails.totalVideos && (
                        <TableRow>
                            <TableCell>Impulsvideos</TableCell>
                            <TableCell>
                                {summaryDetails.totalVideos} {summaryDetails.totalVideos === 1 ? "Video" : "Videos"}
                            </TableCell>
                        </TableRow>
                    )}
                    {summaryDetails.speakerDate && (
                        <TableRow>
                            <TableCell>Speaker Slot</TableCell>
                            <TableCell>{summaryDetails.speakerDate.format("DD.MM.YYYY")}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    );
}
