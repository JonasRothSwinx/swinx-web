import { DialogProps, PartialWith } from "@/app/Definitions/types";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Influencer from "@/app/ServerFunctions/types/influencer";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { Box, Button, Dialog, DialogActions, DialogTitle, SelectChangeEvent } from "@mui/material";

import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "dayjs/locale/de";
import { useEffect, useState } from "react";
import stylesExporter, { timeline } from "../../styles/stylesExporter";
import { DateSelector } from "./EventDetails/DateSelector";
import { submitEvent } from "./actions/submitEvent";
import assignment from "@/app/ServerFunctions/database/dataClients/assignments";
import EventDetails from "./EventDetails/EventDetails";
import dataClient from "@/app/ServerFunctions/database";
import sxStyles from "../sxStyles";
import EmailTriggerMenu from "./EmailTriggerMenu";
import { GeneralDetails } from "./EventDetails/GeneralDetails";
import validateFields from "./actions/validateFields";

export const styles = stylesExporter.dialogs;
type DialogType = TimelineEvent.Event;

export type dates = {
    number: number;
    dates: (Dayjs | null)[];
};
type TimelineEventDialogProps = {
    onClose?: (hasChanged?: boolean) => void;
    editing?: boolean;
    editingData?: DialogType;
    campaignId: string;
    targetAssignment?: Assignment.AssignmentMin;
};
//######################
//#region DefaultValues
const typeDefault: {
    [key in TimelineEvent.eventType]: Partial<TimelineEvent.Event>;
} = {
    Invites: {
        type: "Invites",
        eventAssignmentAmount: 1,
        eventTaskAmount: 1000,
    },
    Post: {
        type: "Post",
        eventAssignmentAmount: 1,
        eventTaskAmount: 0,
    },
    Video: {
        type: "Video",
        eventAssignmentAmount: 1,
        eventTaskAmount: 0,
    },
    WebinarSpeaker: {
        type: "WebinarSpeaker",
        eventAssignmentAmount: 1,
        eventTaskAmount: 0,
    },
    Webinar: {
        type: "Webinar",
        eventAssignmentAmount: 1,
        eventTaskAmount: 0,
        targetAudience: { industry: [], cities: [], country: ["Deutschland"] },
        parentEvent: null,
        childEvents: [],
    },
};
const EventHasEmailTriggers: { [key in TimelineEvent.eventType | "none"]: boolean } = {
    none: false,

    Invites: true,
    Post: true,
    Video: true,
    WebinarSpeaker: true,

    Webinar: false,
};
//#endregion DefaultValues
//######################

export default function TimelineEventDialog(props: TimelineEventDialogProps) {
    //######################
    //#region Props
    const { onClose, editing = false, editingData, campaignId, targetAssignment } = props;
    //#endregion Props
    //######################

    //######################
    //#region Variables
    const queryClient = useQueryClient();

    //#endregion Variables
    //######################

    //######################
    //#region States
    const [timelineEvent, setTimelineEvent] = useState<
        PartialWith<DialogType, "campaign" | "parentEvent" | "childEvents">
    >(
        editingData ?? {
            campaign: { id: campaignId },
            assignments: targetAssignment ? [targetAssignment] : [],
            parentEvent: null,
            childEvents: [],
        },
    );
    const [updatedData, setUpdatedData] = useState<Partial<DialogType>>({});
    const [dates, setDates] = useState<{ number: number; dates: (Dayjs | null)[] }>({
        number: 1,
        dates: [editingData ? dayjs(editingData.date) : dayjs()],
    });

    const influencers = useQuery({
        queryKey: ["influencers"],
        queryFn: async () => {
            return dataClient.influencer.list();
        },
    });

    //#endregion States
    //######################

    //######################
    //#region Effects
    useEffect(() => {
        if (editingData) {
            setTimelineEvent(editingData);
            setDates({ number: 1, dates: [dayjs(editingData.date)] });
        }

        return () => {};
    }, [editingData]);

    useEffect(() => {
        setTimelineEvent((prev) => ({ ...prev, assignment: targetAssignment }));
        return () => {};
    }, [targetAssignment]);

    useEffect(() => {
        setTimelineEvent((prev) => ({ ...prev, campaign: { id: campaignId } }));
        return () => {};
    }, [campaignId]);

    //#endregion Effects
    //######################

    //######################
    //#region Event Handlers
    const EventHandlers = {
        handleClose: (hasChanged?: boolean) => {
            return () => {
                if (onClose) {
                    onClose(hasChanged);
                }
            };
        },
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const combinedEvent = { ...timelineEvent, ...updatedData };
            const type = combinedEvent.type;
            if (!type || !TimelineEvent.isTimelineEventType(type))
                throw new Error("No event type selected");

            if (!validateFields(combinedEvent, type)) return;
            // if (!campaignId || !TimelineEvent.validate(combinedEvent) || !targetAssignment) return;
            // if (!TimelineEvent.isTimelineEvent(combinedEvent)) throw new Error("Invalid event type");

            submitEvent({
                editing,
                event: combinedEvent,
                // campaign,
                dates,
                updatedData,
                // queryClient,
                // assignment: targetAssignment,
            });
            console.log("closing");
            EventHandlers.handleClose(true)();
        },

        printEvent: () => {
            //print all properties of the event on separate lines
            console.log("####################");
            console.log("data");
            Object.entries(timelineEvent).forEach(([key, value]) => {
                console.log(`${key}:`, value);
            });
            console.log("####################");
            console.log("updatedData");
            Object.entries(updatedData).forEach(([key, value]) => {
                console.log(`${key}:`, value);
            });
        },
    };

    const DataChange = {
        type: (e: SelectChangeEvent<unknown>) => {
            const value = e.target.value as TimelineEvent.singleEventType;
            setTimelineEvent(
                (prev) =>
                    ({
                        ...prev,
                        ...typeDefault[value],
                    } satisfies Partial<TimelineEvent.Event>),
            );
        },
        assignment: (e: SelectChangeEvent<unknown>) => {
            const value = e.target.value;
            setTimelineEvent((prev) => ({ ...prev, assignment: value }));
        },
    };

    //#endregion Event Handlers
    //######################

    return (
        <Dialog
            // ref={modalRef}
            open
            className={styles.dialog}
            onClose={EventHandlers.handleClose(false)}
            PaperProps={{
                component: "form",
                onSubmit: EventHandlers.onSubmit,
            }}
            sx={sxStyles.TimelineEventDialog}
        >
            <Box id="EventTriggerSplit">
                <Box id="Event">
                    <DialogTitle>
                        {editing ? "Ereignis bearbeiten" : "Neues Ereignis"}
                        <Button onClick={EventHandlers.printEvent}>Print Event</Button>
                    </DialogTitle>
                    {/* <button onClick={handleCloseModal}>x</button> */}
                    <GeneralDetails
                        event={timelineEvent}
                        editing={editing}
                        targetAssignment={targetAssignment}
                        onInfluencerChange={DataChange.assignment}
                        onTypeChange={DataChange.type}
                        campaignId={campaignId}
                    />
                    <DateSelector
                        timelineEvent={timelineEvent}
                        isEditing={editing}
                        eventType={timelineEvent.type}
                        dates={dates}
                        setDates={setDates}
                        setTimelineEvent={setTimelineEvent}
                    />

                    {/* Details */}
                    <EventDetails
                        key="EventDetails"
                        applyDetailsChange={(data: Partial<TimelineEvent.Event>) =>
                            setTimelineEvent((prev) => ({ ...prev, ...data }))
                        }
                        data={timelineEvent}
                        isEditing={editing}
                        updatedData={updatedData}
                        setUpdatedData={setUpdatedData}
                    />

                    <DialogActions
                        sx={{
                            justifyContent: "space-between",
                        }}
                    >
                        <Button onClick={EventHandlers.handleClose(false)} color="secondary">
                            Abbrechen
                        </Button>
                        <Button variant="contained" type="submit">
                            Speichern
                        </Button>
                    </DialogActions>
                </Box>
                {EventHasEmailTriggers[timelineEvent.type ?? "none"] &&
                    editing &&
                    timelineEvent.id && (
                        <Box id="Trigger" width="500px">
                            <EmailTriggerMenu eventId={timelineEvent.id} />
                        </Box>
                    )}
            </Box>
        </Dialog>
    );
}
