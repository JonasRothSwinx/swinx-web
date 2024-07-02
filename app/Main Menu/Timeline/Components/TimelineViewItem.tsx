import { CancelIcon, EditIcon } from "@/app/Definitions/Icons";
import { Event } from "@/app/ServerFunctions/types";
import { dayjs } from "@/app/utils";
import { Box, Unstable_Grid2 as Grid, IconButton, SxProps } from "@mui/material";
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

    return (
        <Grid
            id="TimelineViewGroup"
            // xs={16}
            key={keyValue}
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
        </Grid>
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
    return (
        <Box id="TimelineViewGroupTitle">
            <div className={dialogStyles.cellActionSplit}>
                <div>{titleContentByGroupType[groupedBy]()}</div>
                {/* <TimelineViewEditButton editable={editable} editing={editing} setEditing={setEditing} /> */}
            </div>
        </Box>
    );
}
