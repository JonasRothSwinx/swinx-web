import { Campaign, Event, Events } from "@/app/ServerFunctions/types";
import {
    Box,
    CircularProgress,
    Unstable_Grid2 as Grid,
    GridSize,
    IconButton,
    Skeleton,
    SxProps,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import { groupBy } from "../Functions/groupEvents";
import { dayjs } from "@/app/utils";
import { timelineEventTypesType } from "@/amplify/data/types";
import EventContentSingle from "./EventContentSingle";
import EventContentMulti from "./EventContentMulti";
import { Query, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddIcon, DeleteIcon, EditIcon, RefreshIcon } from "@/app/Definitions/Icons";
import { Nullable, highlightData } from "@/app/Definitions/types";
import { dataClient } from "@/app/ServerFunctions/database";
import { useMemo, useState } from "react";
import { useConfirm } from "material-ui-confirm";
import { TimelineEventDialog } from "@/app/Components";
const config = {
    lineheight: 20,
};

interface EventProps {
    campaignId: string;
    event: Event;
    groupBy: groupBy;
    totalColumns?: number;
    highlightData?: highlightData;
    editable?: boolean;
}
export function EventDisplay(props: EventProps) {
    const {
        campaignId,
        event: { id = "", tempId },
        groupBy,
        totalColumns = 12,
        highlightData,
        editable = false,
    } = props;
    //######################################################################################################################
    //#region Query
    const event = useQuery({
        queryKey: ["timelineEvent", id, props.event, tempId],
        queryFn: () => {
            if (tempId !== undefined) return props.event;
            return dataClient.timelineEvent.get(id);
        },
    });
    const campaign = useQuery({
        queryKey: ["campaign", campaignId],
        queryFn: () => {
            return dataClient.campaign.get(campaignId);
        },
    });
    //#endregion Query
    //######################################################################################################################

    const EventHandlers = {
        deleteFunction: async () => {
            if (!event.data || !event.data.id) return;
            await dataClient.timelineEvent
                .delete(event.data.id)
                .then(() => console.log(`Deleted event ${event.data.id}`))
                .catch((e) => console.error(e));
        },
        setEvent: async (updatedData: Partial<Event>) => {
            if (!event.data) return;
            if (!event.data.id) return console.error("Event has no id");
            console.log("Updating event", updatedData, event.data);
            const newEvent = await dataClient.timelineEvent.update({
                id: event.data.id,
                updatedData,
            });
            console.log("Updated event", newEvent);
        },
    };
    //######################################################################################################################
    //#region Styles
    const dateColumns = useMemo(() => (groupBy === "day" ? 2 : 3), [groupBy]);
    const contentColumns = useMemo(() => totalColumns - dateColumns /* - modifyColumns */, [totalColumns, dateColumns]);
    const isOverdue = useMemo(() => {
        if (!event.data) return false;
        const eventDate = dayjs(event.data.date);
        const now = dayjs();
        return eventDate.isBefore(now);
    }, [event.data]);

    const sxProps: SxProps = useMemo(() => {
        return {
            "&#EventRow": {
                position: "relative",
                // "display": "flex",
                // "flexDirection": "row",
                alignItems: "center",
                // flexWrap: "wrap",
                width: "100%",
                padding: "0",
                margin: "0",
                backgroundColor: event.data?.isCompleted ? "green" : isOverdue ? "red" : "inherit",
                // backgroundColor: "green",
                "& *": event.data?.isCompleted && {
                    textDecoration: "line-through",
                },
                "&:hover": {
                    backgroundColor: "lightgrey",
                    "#modifyButtonGroup": {
                        display: editable ? "flex" : "none",
                        width: "40px",
                        backgroundColor: "lightgrey",

                        "@keyframes fadeIn": {
                            from: { opacity: 0, width: 0 },
                            to: { opacity: 1, width: 40 },
                        },
                        animation: "fadeIn linear 0.3s",
                    },
                },

                ".MuiTableCell-root": {
                    padding: "0",
                    minWidth: "max-content",
                    paddingRight: "3px",
                    paddingLeft: "3px",
                    "&:first-of-type": {
                        paddingLeft: "5px",
                    },

                    "&.date": {
                        // paddingLeft: "5px",
                        paddingRight: "5px",
                        borderRight: "1px solid rgba(224, 224, 224, 1)",
                    },
                    "&.EventContentCell": {
                        ".EventContent": {
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        },
                    },
                    // border: "1px solid black",
                },
                "&>#Event": {
                    "&": {
                        position: "relative",
                        paddingLeft: "5px",
                        flex: 1,
                        backgroundColor: highlightData?.color ?? "inherit",
                        // transition: "width 3s",
                        overflow: "hidden",
                        overflowY: "hidden",
                    },
                },

                "&>#fetchIndicator": {
                    display: event.isFetching ? "inline-block" : "none",
                    maxHeight: `${config.lineheight * 0.6}px`,
                    maxWidth: `${config.lineheight * 0.6}px`,
                    position: "absolute",
                    // top: "10px",
                    left: "50%",
                    zIndex: 1000,
                    svg: {
                        height: "100%",
                        width: "100%",
                    },
                },

                "&>#modifyButtonGroup": {
                    "&": {
                        display: "none",
                        justifyContent: "right",
                        overflow: "hidden",

                        "@keyframes fadeOut": {
                            from: { opacity: 1, width: 40, display: "flex" },
                            to: { opacity: 0, width: 0 },
                        },
                        animation: "fadeOut linear 0.3s",
                    },

                    "&>#editButton, &>#deleteButton": {
                        //display: "none",
                        height: `${config.lineheight}px`,
                        width: `${config.lineheight}px`,
                        padding: "0",
                        svg: {
                            maxHeight: "100%",
                            maxWidth: "100%",
                        },
                    },
                },
            },
        };
    }, [highlightData, event.isFetching, editable, event.data?.isCompleted, isOverdue]);

    //#endregion Styles
    //######################################################################################################################

    //######################################################################################################################
    //#region Data State
    if (!event.data || !campaign.data) return <></>;
    if (event.isLoading || campaign.isLoading) return <Skeleton width={"100%"} />;
    if (event.isError || campaign.isError)
        return (
            <Typography>
                Error
                <br />
                Event: {JSON.stringify(event.error)}
                <br />
                Campaign: {JSON.stringify(campaign.error)}
            </Typography>
        );
    //#endregion Data State
    //######################################################################################################################
    return (
        <TableRow id="EventRow" sx={sxProps}>
            {/* <Grid
                id="Event"
                container
                columns={totalColumns}
            > */}
            {dateColumns > 0 && <EventDate date={event.data.date ?? ""} groupBy={groupBy} columnSize={dateColumns} />}
            <EventContent event={event.data} columnSize={contentColumns} />
            {/* </Grid> */}
            <CircularProgress id="fetchIndicator" />

            {editable && (
                <ModifyButtonGroup
                    {...({
                        deleteFunction: EventHandlers.deleteFunction,
                        event: event.data,
                        setEvent: EventHandlers.setEvent,
                        campaign: campaign.data,
                    } satisfies ModifyButtonGroupProps)}
                />
            )}
        </TableRow>
    );
}
//######################################################################################################################
//#region EventContent
interface EventContentProps {
    event: Event;
    columnSize?: number | GridSize;
}
function EventContent(props: EventContentProps) {
    const { event, columnSize = 10 } = props;
    switch (true) {
        case Events.isSingleEvent(event): {
            return <EventContentSingle event={event} columnSize={columnSize} />;
        }
        case Events.isMultiEvent(event): {
            return <EventContentMulti event={event} columnSize={columnSize} />;
        }
        default: {
            return <>{"Error: Event Type not recognized"}</>;
        }
    }
}

//#endregion EventContent
//######################################################################################################################

//######################################################################################################################
//#region ModifyButtonGroup
interface ModifyButtonGroupProps {
    deleteFunction: () => void;
    campaign: Campaign;
    event: Event;
    setEvent: (updatedData: Partial<Event>) => void;
}
function ModifyButtonGroup(props: ModifyButtonGroupProps) {
    const { setEvent, event, deleteFunction, campaign } = props;
    return (
        <Box id="modifyButtonGroup">
            <EditButton //
                setEvent={setEvent}
                event={event}
                campaign={campaign}
            />
            <DeleteButton deleteFunction={deleteFunction} />
        </Box>
    );
}
interface EditButtonProps {
    setEvent: (updatedData: Partial<Event>) => void;
    event: Event;
    campaign: Campaign;
}
function EditButton(props: EditButtonProps) {
    const { event, campaign } = props;
    const [isOpen, setIsOpen] = useState(false);

    const EventHandler = {
        openDialog: () => {
            setIsOpen(true);
        },
        closeDialog: () => {
            setIsOpen(false);
        },
    };

    return (
        <>
            {isOpen && (
                <TimelineEventDialog
                    onClose={EventHandler.closeDialog}
                    editingData={event}
                    campaignId={campaign.id}
                    editing={true}
                    targetAssignment={event.assignments ? event.assignments[0] : undefined}
                />
            )}
            <IconButton
                id="editButton"
                onClick={() => {
                    console.log("Opening dialog");
                    console.log(event);
                    EventHandler.openDialog();
                }}
            >
                <EditIcon fontSize="inherit" />
            </IconButton>
        </>
    );
}
interface DeleteButtonProps {
    deleteFunction: () => void;
}
function DeleteButton(props: DeleteButtonProps) {
    const { deleteFunction } = props;

    const confirm = useConfirm();
    const deleteHandler = async () => {
        confirm({
            title: "Wirklich löschen?",
            content: "Diese Aktion kann nicht rückgängig gemacht werden",
        }).then(() => {
            deleteFunction();
            // console.log("Deleting event");
        });
    };
    return (
        <IconButton id="deleteButton" onClick={deleteHandler}>
            <DeleteIcon color="error" />
        </IconButton>
    );
}
//#endregion ModifyButtonGroup
//######################################################################################################################

//######################################################################################################################
//#region EventDate
interface EventDateProps {
    columnSize?: number | GridSize;
    date: string;
    groupBy: groupBy;
}
function EventDate(props: EventDateProps) {
    const { date, groupBy, columnSize = 2 } = props;
    const processedDate = dayjs(date);
    const sxProps: SxProps = {
        "&": {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "1cw",
        },
    };
    const dateDisplay: { [key in groupBy]: JSX.Element } = {
        day: <>{processedDate.format("h:mm")}</>,
        week: (
            // <Box sx={sxProps}>
            <>
                <TableCell>
                    <Typography className="dayName">{processedDate.format("ddd")}</Typography>
                </TableCell>
                <TableCell className="date">{processedDate.format("DD.MM.")}</TableCell>
            </>
            // </Box>
        ),
    };

    return (
        // <TableCell
        //     id="EventDate"
        //     xs={columnSize}
        // >
        <>{dateDisplay[groupBy]}</>
        // </TableCell>
    );
}
//#endregion EventDate
//######################################################################################################################
