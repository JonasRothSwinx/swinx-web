import { CancelIcon, EditIcon } from "@/app/Definitions/Icons";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import dayjs from "@/app/utils/configuredDayJs";
import { Unstable_Grid2 as Grid, IconButton, SxProps } from "@mui/material";
import { GridDeleteForeverIcon } from "@mui/x-data-grid";
import { useState } from "react";
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
    editEvent: (event: TimelineEvent.Event) => void;
}
export default function TimelineViewItem(props: TimelineViewItemProps) {
    const { keyValue, group, groupedBy, editEvent } = props;
    const [editing, setEditing] = useState(false);
    const [editable, setEditable] = useState(props.editable);

    const sxContent: SxProps = {
        display: "flex",
        flexDirection: "column",
        border: "1px solid black",
        borderRadius: "10px",
        height: "fit-content",
        maxWidth: "100%",
    };
    const sxEditing: SxProps = {
        "& .MuiGrid2-container:hover": {
            border: "1px solid black",
            borderRadius: "5px",
            backgroundColor: "lightgray",
        },
        "& .MuiGrid2-container": {
            alignItems: "center",
        },
    };
    const sxNotEditing: SxProps = {
        "& .MuiGrid2-container": {
            alignItems: "center",
        },
    };

    return (
        <Grid
            // xs={16}
            key={keyValue}
            sx={{
                ...sxContent,
                ...(editing ? sxEditing : sxNotEditing),
            }}
        >
            <TimelineViewGroupTitle
                group={group}
                groupedBy={groupedBy}
                editable={editable}
                editing={editing}
                setEditing={setEditing}
            />
            <div
                style={{
                    paddingBlock: "5px",
                }}
            >
                {group.events.map((event, i) => {
                    return (
                        <TypedEventGroupDisplay
                            key={i}
                            eventGroup={event}
                            groupBy={groupedBy}
                            editing={editing}
                            campaignId={props.campaignId}
                        />
                    );
                })}
            </div>
        </Grid>
    );
}
interface TimelineViewGroupTitleProps {
    group: EventGroup;
    groupedBy: groupBy;
    editable: boolean;
    editing: boolean;
    setEditing: (e: boolean) => void;
}
function TimelineViewGroupTitle(
    props: TimelineViewGroupTitleProps,
    // { group, groupedBy, editable, editing, setEditing }
) {
    const { group, groupedBy, editable, editing, setEditing } = props;
    const groupStartDate = dayjs(group.dateGroupStart);
    const titleContentByGroupType: { [key in groupBy]: JSX.Element } = {
        day: (
            <>
                {groupStartDate.format("ddd, DD.MM")} ({groupStartDate.fromNow()})
            </>
        ),
        week: (
            <>
                KW {groupStartDate.week()}
                {groupStartDate.year() !== dayjs().year() && ` - ${groupStartDate.year()}`} (
                {groupStartDate.format("DD.MM")} - {groupStartDate.day(7).format("DD.MM")})
            </>
        ),
    };
    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                padding: "5px",
                paddingBlockEnd: "10px",
                borderBottom: "1px solid black",
            }}
        >
            <div className={dialogStyles.cellActionSplit}>
                <div>{titleContentByGroupType[groupedBy]}</div>
                <TimelineViewEditButton
                    editable={editable}
                    editing={editing}
                    setEditing={setEditing}
                />
            </div>
        </div>
    );
}
interface TimelineViewEditButtonProps {
    editable: boolean;
    editing: boolean;
    setEditing: (e: boolean) => void;
}
function TimelineViewEditButton(props: TimelineViewEditButtonProps) {
    const { editable, editing, setEditing } = props;
    return (
        <>
            {editable && (
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {!editing && (
                        <IconButton
                            onClick={() => {
                                setEditing(true);
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    )}
                    {editing && (
                        <>
                            <IconButton onClick={() => {}}>
                                <GridDeleteForeverIcon color="error" />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    setEditing(false);
                                }}
                            >
                                <CancelIcon />
                            </IconButton>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
