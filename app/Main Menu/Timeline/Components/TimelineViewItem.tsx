import { CancelIcon, EditIcon } from "@/app/Definitions/Icons";
import { Event } from "@/app/ServerFunctions/types";
import { dayjs } from "@/app/utils";
import {
    Box,
    Unstable_Grid2 as Grid,
    IconButton,
    SxProps,
    Table,
    TableHead,
    Typography,
} from "@mui/material";
import { GridDeleteForeverIcon } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import stylesExporter from "../../styles/stylesExporter";
import { EventGroup, groupBy } from "../Functions/groupEvents";
import EventGroupDisplay from "./TimelineViewItemTypedGroup";
import TypedEventGroupDisplay from "./TimelineViewItemTypedGroup";

const dialogStyles = stylesExporter.dialogs;
const timelineStyles = stylesExporter.timeline;

interface TimelineViewItemProps {
    campaignId: string;
    keyValue: string | number;
    group: EventGroup;
    groupedBy: groupBy;
    editable: boolean;
    editEvent: (event: Event) => void;
}
export default function TimelineViewItem(props: TimelineViewItemProps) {
    const { keyValue, group, groupedBy, editEvent, editable } = props;
    const sx: SxProps = useMemo(
        () => ({
            "&": {
                "&#TimelineViewGroup": {
                    "display": "flex",
                    "flexDirection": "column",
                    "border": "1px solid black",
                    "borderRadius": "10px",
                    "height": "fit-content",
                    "maxWidth": "100%",
                    "overflow": "hidden",

                    ".MuiGrid2-container": {
                        alignItems: "center",
                    },
                },
            },
        }),
        [],
    );
    return (
        <Table
            id="TimelineViewGroup"
            // xs={16}
            key={keyValue}
            sx={sx}
        >
            <TimelineViewGroupTitle
                group={group}
                groupedBy={groupedBy}
            />
            {group.events.map((event, i) => {
                return (
                    <TypedEventGroupDisplay
                        key={i}
                        eventGroup={event}
                        groupBy={groupedBy}
                        editable={editable}
                        campaignId={props.campaignId}
                    />
                );
            })}
        </Table>
    );
}
interface TimelineViewGroupTitleProps {
    group: EventGroup;
    groupedBy: groupBy;
}
function TimelineViewGroupTitle(props: TimelineViewGroupTitleProps) {
    const { group, groupedBy } = props;
    const groupStartDate = dayjs(group.dateGroupStart);
    const titleContentByGroupType: { [key in groupBy]: () => JSX.Element } = {
        day: () => (
            <>
                {groupStartDate.format("ddd, DD.MM")} ({groupStartDate.fromNow()})
            </>
        ),
        week: () => (
            <>
                KW {groupStartDate.week()}
                {groupStartDate.year() !== dayjs().year() && ` - ${groupStartDate.year()}`} (
                {groupStartDate.format("DD.MM")} - {groupStartDate.day(7).format("DD.MM")})
            </>
        ),
    };
    const sx: SxProps = {
        "&": {
            "&#TimelineViewGroupTitle": {
                width: "100%",
                display: "flex",
                padding: "5px",
                paddingBlockEnd: "10px",
                borderBottom: "1px solid black",
                backgroundColor: "var(--swinx-blue)",
                color: "white",
            },
        },
    };
    return (
        <TableHead
            id="TimelineViewGroupTitle"
            sx={sx}
        >
            {/* <div className={dialogStyles.cellActionSplit}> */}
            <Typography className={"tableHeaderText"}>
                {titleContentByGroupType[groupedBy]()}
            </Typography>
            {/* <TimelineViewEditButton editable={editable} editing={editing} setEditing={setEditing} /> */}
            {/* </div> */}
        </TableHead>
    );
}
