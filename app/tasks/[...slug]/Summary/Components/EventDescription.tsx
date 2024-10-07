import { Box, Table, TableBody, TableRow, TableCell, SxProps, Typography } from "@mui/material";
import { Campaign, Webinar } from "../../Functions/Database/types";
import { dayjs } from "@/app/utils";

interface EventDescriptionProps {
    webinar: Webinar;
    campaign: Campaign;
}

export function EventDescription({ webinar, campaign }: EventDescriptionProps) {
    const customerName = campaign.customerCompany;
    const eventTypeName = webinar.timelineEventType;
    const eventDate = dayjs(webinar.date);
    const topic = webinar.eventTitle;
    const sx: SxProps = {
        "&.SummaryTable": {
            ".MuiTableRow-root": {
                ".MuiTableCell-root": {
                    // maxWidth: "30ch",
                    textWrap: "wrap",
                    // fontSize: 22,
                },
            },
        },
    };
    return (
        <Box
            sx={sx}
            className="SummaryTable"
        >
            <Typography className="SummaryTableTitle">Kampagnendetails</Typography>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Auftraggeber</TableCell>
                        <TableCell>
                            <strong>{customerName}</strong>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Eventdatum</TableCell>
                        <TableCell>
                            <strong>{eventDate.format("DD.MM.YYYY")}</strong>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Eventart</TableCell>
                        <TableCell>{eventTypeName}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Thema</TableCell>
                        <TableCell>{topic}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Box>
    );
}
