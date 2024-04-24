import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import {
    Box,
    CircularProgress,
    Unstable_Grid2 as Grid,
    GridSize,
    IconButton,
    Skeleton,
    SxProps,
    Typography,
} from "@mui/material";
import { groupBy } from "../Functions/groupEvents";
import dayjs from "@/app/utils/configuredDayJs";
import { timelineEventTypesType } from "@/amplify/data/types";
import EventContentSingle from "./EventContentSingle";
import EventContentMulti from "./EventContentMulti";
import { Query, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddIcon, DeleteIcon, EditIcon, RefreshIcon } from "@/app/Definitions/Icons";
import Campaign from "@/app/ServerFunctions/types/campaign";
import { Nullable, highlightData } from "@/app/Definitions/types";
import dataClient from "@/app/ServerFunctions/database";
import { useMemo, useState } from "react";
import TimelineEventSingleDialog from "../../Dialogs/TimelineEvent/SingleEvent/TimelineEventSingleDialog";
import TimelineEventMultiDialog from "../../Dialogs/TimelineEvent/MultiEvent/TimelineEventMultiDialog";
import { useConfirm } from "material-ui-confirm";
const config = {
    lineheight: 20,
};

interface EventProps {
    campaignId: string;
    event: TimelineEvent.Event;
    groupBy: groupBy;
    totalColumns?: number;
    highlightData?: highlightData;
    editable?: boolean;
}
export function Event(props: EventProps) {
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
        queryKey: ["timelineEvent", id],
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
            await dataClient.timelineEvent.delete(event.data.id);
        },
        setEvent: async (updatedData: Partial<TimelineEvent.Event>) => {
            if (!event.data) return;
            console.log("Updating event", updatedData, event.data);
            const newEvent = await dataClient.timelineEvent.update(updatedData, event.data);
            console.log("Updated event", newEvent);
        },
    };
    //######################################################################################################################
    //#region Styles
    const dateColumns = useMemo(() => (groupBy === "day" ? 2 : 1), [groupBy]);
    const contentColumns = useMemo(() => totalColumns - dateColumns /* - modifyColumns */, [totalColumns, dateColumns]);

    const sxProps: SxProps = useMemo(() => {
        const sx: SxProps = {
            "&#EventContainer": {
                "&": {
                    position: "relative",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    // flexWrap: "wrap",
                    width: "100%",
                    padding: "0",
                    margin: "0",
                },
                "&:hover": {
                    "&": {
                        backgroundColor: "lightgrey",
                    },
                    "#modifyButtonGroup": {
                        display: editable ? "flex" : "none",
                        width: "40px",

                        "@keyframes fadeIn": {
                            from: { opacity: 0, width: 0 },
                            to: { opacity: 1, width: 40 },
                        },
                        animation: "fadeIn linear 0.3s",
                    },
                },

                "&>#Event": {
                    "&": {
                        position: "relative",
                        paddingLeft: "10px",
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
        return sx;
    }, [highlightData, event.isFetching, editable]);

    //#endregion Styles
    //######################################################################################################################

    //######################################################################################################################
    //#region Data State
    if (!event.data || !campaign.data) return <></>;
    if (event.isLoading || campaign.isLoading) return <Skeleton width={"100%"} />;
    if (event.isError || campaign.isError) return <Typography>Error</Typography>;
    //#endregion Data State
    //######################################################################################################################
    return (
        <Box id="EventContainer" sx={sxProps}>
            <Grid id="Event" container columns={totalColumns}>
                {dateColumns > 0 && (
                    <EventDate date={event.data.date ?? ""} groupBy={groupBy} columnSize={dateColumns} />
                )}
                <EventContent event={event.data} columnSize={contentColumns} />
            </Grid>
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
        </Box>
    );
}
//######################################################################################################################
//#region EventContent
interface EventContentProps {
    event: TimelineEvent.Event;
    columnSize?: number | GridSize;
}
function EventContent(props: EventContentProps) {
    const { event, columnSize = 10 } = props;
    switch (true) {
        case TimelineEvent.isSingleEvent(event): {
            return <EventContentSingle event={event} columnSize={columnSize} />;
        }
        case TimelineEvent.isMultiEvent(event): {
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
    campaign: Campaign.Campaign;
    event: TimelineEvent.Event;
    setEvent: (updatedData: Partial<TimelineEvent.Event>) => void;
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
    setEvent: (updatedData: Partial<TimelineEvent.Event>) => void;
    event: TimelineEvent.Event;
    campaign: Campaign.Campaign;
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
    const Dialog = () => {
        switch (true) {
            case TimelineEvent.isSingleEvent(event): {
                return (
                    <TimelineEventSingleDialog
                        {...{
                            onClose: EventHandler.closeDialog,
                            parent: campaign,
                            editing: true,
                            editingData: event as TimelineEvent.SingleEvent,
                            campaignId: event.campaign.id,
                            targetAssignment: event.assignments[0],
                        }}
                    />
                );
            }
            case TimelineEvent.isMultiEvent(event): {
                return null;
                // return (
                //     <TimelineEventMultiDialog
                //         {...{
                //             onClose: EventHandler.closeDialog,
                //             parent: campaign,
                //             editing: true,
                //             editingData: event as TimelineEvent.MultiEvent,
                //             campaignId: event.campaign.id,
                //             targetAssignments: event.assignments,
                //         }}
                //     />
                // );
            }
            default: {
                return <></>;
            }
        }
    };

    return (
        <>
            {isOpen && Dialog()}
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
            // deleteFunction();
            console.log("Deleting event");
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
    const dateDisplay: { [key in groupBy]: JSX.Element } = {
        day: <>{processedDate.format("h:mm")}</>,
        week: <>{processedDate.format("ddd")}</>,
    };

    return (
        <Grid id="EventDate" xs={columnSize}>
            {dateDisplay[groupBy]}
        </Grid>
    );
}
//#endregion EventDate
//######################################################################################################################
