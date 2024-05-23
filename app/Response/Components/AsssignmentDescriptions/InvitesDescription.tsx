import dayjs from "@/app/utils/configuredDayJs";
import {
    Box,
    List,
    SxProps,
    Table,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { TimelineEvent, Webinar } from "../../Functions/Database/types";
import Loading from "../Loading";
import { displayCountryString } from "../../Functions/displayCountryString";
import dateToRange from "../../Functions/dateToRange";

//MARK: InvitesDescription
interface InvitesDescriptionProps {
    events: TimelineEvent[];
}
export function InvitesDescription({ events }: InvitesDescriptionProps) {
    const queryClient = useQueryClient();
    const webinar = queryClient.getQueryData<Webinar>(["parentEvent"]);
    const style: SxProps = useMemo(() => ({}), []);
    if (!events || !webinar) {
        queryClient.refetchQueries();
        return <Loading />;
    }
    return (
        <Box id="DescriptionContainer" sx={style}>
            <Box id="DescriptionTitle">
                <Typography id="SummaryTitle">Einladungen</Typography>
            </Box>
            <Box id="SummaryContainer">
                <Box id="SummaryBox">
                    <Typography>
                        An folgenden Terminen werden Sie Einladungen zum Event des Kunden an Ihre
                        Follower*innen verschicken.
                        <br />
                        Zielgruppe für das Event sind Profile aus{" "}
                        {displayCountryString(webinar.targetAudience?.country ?? [])} innerhalb der
                        folgenden Branchen:
                    </Typography>
                    <Box>
                        <List>
                            {webinar.targetAudience?.industry?.map((industry) => (
                                <Typography key={industry}>
                                    <strong>{`> `}</strong>
                                    {industry}
                                </Typography>
                            ))}
                        </List>
                    </Box>
                </Box>
                <Table id="InvitesTable">
                    <TableHead>
                        <TableRow>
                            <TableCell>Zeitraum</TableCell>
                            <TableCell>Einladungen</TableCell>
                        </TableRow>
                    </TableHead>
                    {events.map((event) => {
                        const { startDate, endDate } = dateToRange({
                            date: event.date,
                            format: "DD.MM",
                        });
                        return (
                            <TableRow key={event.id}>
                                <TableCell>{`${startDate} - ${endDate}`}</TableCell>
                                <TableCell>{event.eventTaskAmount}</TableCell>
                            </TableRow>
                        );
                    })}
                </Table>
            </Box>
        </Box>
    );
}
