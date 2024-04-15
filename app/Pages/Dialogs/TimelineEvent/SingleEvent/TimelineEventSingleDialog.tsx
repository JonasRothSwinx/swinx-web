import { DialogProps, PartialWith } from "@/app/Definitions/types";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Influencer from "@/app/ServerFunctions/types/influencer";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    SelectChangeEvent,
    TextField,
} from "@mui/material";

import dayjs, { Dayjs } from "@/app/utils/configuredDayJs";
import { useQueryClient } from "@tanstack/react-query";
import "dayjs/locale/de";
import { useEffect, useState } from "react";
import stylesExporter from "../../../styles/stylesExporter";
import { DateSelector } from "../DateSelector";
import InviteDetails from "./SingleEventDetails/InviteEventDetails";
import WebinarSpeakerDetails from "./SingleEventDetails/WebinarSpeakerDetails";
import { submitSingleEvent } from "./submitSingleEvent";
import PostEventDetails from "./SingleEventDetails/PostEventDetails";
import assignment from "@/app/ServerFunctions/database/dataClients/assignments";
import SingleEventDetails from "./SingleEventDetails/SingleEventDetails";

export const styles = stylesExporter.dialogs;
type DialogType = TimelineEvent.SingleEvent;
// const initEvent: Partial<DialogType> = {
//     type: undefined,
// };

export type TimelineEventDialogProps = DialogProps<Campaign.Campaign, DialogType> & {
    influencers: Influencer.Full[];
    targetAssignment: Assignment.AssignmentMin;
};
export type dates = {
    number: number;
    dates: (Dayjs | null)[];
};
export default function TimelineEventSingleDialog(props: TimelineEventDialogProps) {
    //######################
    //#region Props
    const {
        onClose,
        parent: campaign,
        setParent: setCampaign,
        isOpen = true,
        editing = false,
        editingData,
        campaignId,
        targetAssignment,
    } = props;
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
        PartialWith<DialogType, "campaign" | "relatedEvents">
    >(
        editingData ?? {
            campaign: { id: campaign.id },
            assignments: [targetAssignment],
            relatedEvents: { parentEvent: null, childEvents: [] },
        },
    );
    const [dates, setDates] = useState<{ number: number; dates: (Dayjs | null)[] }>({
        number: 1,
        dates: [editingData ? dayjs(editingData.date) : dayjs()],
    });
    const [influencers, setInfluencers] = useState(props.influencers);

    //#endregion States
    //######################

    //######################
    //#region Effects
    useEffect(() => {
        if (editingData && isOpen) {
            setTimelineEvent(editingData);
            setDates({ number: 1, dates: [dayjs(editingData.date)] });
        }

        return () => {};
    }, [editingData, isOpen]);

    useEffect(() => {
        setTimelineEvent((prev) => ({ ...prev, assignment: targetAssignment }));
        return () => {};
    }, [targetAssignment]);

    useEffect(() => {
        setTimelineEvent((prev) => ({ ...prev, campaign }));
        return () => {};
    }, [campaign]);

    //#endregion Effects
    //######################

    //######################
    //#region DefaultValues
    const typeDefault: {
        [key in TimelineEvent.singleEventType]: Partial<TimelineEvent.SingleEvent>;
    } = {
        Invites: {
            type: "Invites",
            eventAssignmentAmount: 1,
            eventTaskAmount: 1000,
        },
        Post: {
            type: "Post",
            eventAssignmentAmount: 1,
        },
        Video: {
            type: "Video",
            eventAssignmentAmount: 1,
        },
        WebinarSpeaker: {
            type: "WebinarSpeaker",
            eventAssignmentAmount: 1,
        },
    };
    //#endregion DefaultValues
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
            if (!campaign || !TimelineEvent.validate(timelineEvent) || !targetAssignment) return;
            if (!TimelineEvent.isSingleEvent(timelineEvent)) throw new Error("Invalid event type");

            submitSingleEvent({
                editing,
                event: timelineEvent,
                campaign,
                dates,
                queryClient,
                // assignment: targetAssignment,
            });
            console.log("closing");
            EventHandlers.handleClose(true)();
        },

        printEvent: () => {
            //print all properties of the event on separate lines
            Object.entries(timelineEvent).forEach(([key, value]) => {
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
                    } satisfies Partial<TimelineEvent.SingleEvent>),
            );
        },
        assignment: (e: SelectChangeEvent<unknown>) => {
            const value = e.target.value;
            setTimelineEvent((prev) => ({ ...prev, assignment: value }));
        },
    };

    //#endregion Event Handlers
    //######################

    //######################
    //#region Conditional Elements

    // const eventDetailFields: { [key in TimelineEvent.singleEventType]: JSX.Element } = {
    //     Invites: (
    //         <InviteDetails
    //             key="InviteDetails"
    //             onChange={(data) => setTimelineEvent((prev) => ({ ...prev, ...data }))}
    //             data={timelineEvent as Partial<TimelineEvent.Invites>}
    //         />
    //     ),
    //     Post: (
    //         <PostEventDetails
    //             key={"PostDetails"}
    //             onChange={setTimelineEvent}
    //             data={timelineEvent as Partial<TimelineEvent.Post>}
    //         />
    //     ),
    //     Video: <></>,
    //     WebinarSpeaker: (
    //         <WebinarSpeakerDetails
    //             key="WebinarDetails"
    //             onChange={(data) => setTimelineEvent((prev) => ({ ...prev, ...data }))}
    //             data={timelineEvent as Partial<TimelineEvent.WebinarSpeaker>}
    //             campaignId={campaignId}
    //         />
    //     ),
    // };

    //#endregion Conditional Elements
    //######################

    return (
        <Dialog
            // ref={modalRef}
            open={isOpen}
            className={styles.dialog}
            onClose={EventHandlers.handleClose(false)}
            PaperProps={{
                component: "form",
                onSubmit: EventHandlers.onSubmit,
            }}
            sx={{
                "& .MuiDialogContent-root": {
                    maxWidth: "80vw",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    // width: "520px",
                },
                "& .MuiFormControl-root": {
                    // padding: "5px",
                    minWidth: "20ch",
                    margin: "5px",
                    flex: 1,
                },
                "& .MuiDialogContentText-root": {
                    flexBasis: "100%",
                    flexShrink: 0,
                },
                "& .MuiDialogContent-dividers:nth-of-type(even)": {
                    // display: "none",
                    border: "none",
                },
            }}
        >
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
                campaign={campaign}
            />
            <DateSelector
                timelineEvent={timelineEvent}
                isEditing={editing}
                eventType={timelineEvent.type ?? "Invites"}
                dates={dates}
                setDates={setDates}
                setTimelineEvent={setTimelineEvent}
            />

            {/* Details */}
            <SingleEventDetails
                key="SingleEventDetails"
                applyDetailsChange={(data: Partial<TimelineEvent.SingleEvent>) =>
                    setTimelineEvent((prev) => ({ ...prev, ...data }))
                }
                data={timelineEvent}
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
        </Dialog>
    );
}
interface EventTypeSelectorProps {
    event: Partial<TimelineEvent.SingleEvent>;
    editing: boolean;
    campaign: Campaign.Campaign;
    targetAssignment: Assignment.AssignmentMin;
    onInfluencerChange: (e: SelectChangeEvent<unknown>) => void;
    onTypeChange: (e: SelectChangeEvent<unknown>) => void;
}
function GeneralDetails(props: EventTypeSelectorProps) {
    const {
        event: timelineEvent,
        onInfluencerChange,
        onTypeChange,
        editing,
        targetAssignment,
        campaign,
    } = props;
    return (
        <DialogContent dividers sx={{ "& .MuiFormControl-root": { flexBasis: "100%" } }}>
            <TextField
                select
                disabled={editing}
                name="timelineEventType"
                label="Ereignistyp"
                // value={timelineEvent.type ?? ""}
                size="medium"
                required
                SelectProps={{
                    // sx: { minWidth: "15ch" },
                    value: timelineEvent.type ?? "",
                    onChange: onTypeChange,
                }}
                error={timelineEvent.type === undefined}
                variant="standard"
            >
                {TimelineEvent.singleEventValues.map((x, i) => {
                    return (
                        <MenuItem key={`eventtype${i}`} value={x}>
                            {x}
                        </MenuItem>
                    );
                })}
            </TextField>
            <TextField
                select
                disabled={targetAssignment !== undefined}
                name="influencer"
                label="Influencer"
                size="medium"
                required
                variant="standard"
                SelectProps={{
                    value: timelineEvent.assignments?.[0].id ?? "",
                    onChange: onInfluencerChange,
                }}
            >
                {campaign.assignedInfluencers.map((assignment, i, a) => {
                    // debugger;
                    if (assignment.isPlaceholder) {
                        return (
                            <MenuItem key={`influencer${assignment.id}`} value={assignment.id}>
                                {`Influencer ${assignment.placeholderName}`}
                            </MenuItem>
                        );
                    }
                    return (
                        <MenuItem key={`influencer${assignment.id}`} value={assignment.id}>
                            {`${assignment.influencer?.firstName} ${assignment.influencer?.lastName}`}
                        </MenuItem>
                    );
                })}
            </TextField>
            {/* <FormControl sx={{ margin: "5px", flex: 1, minWidth: "200px" }}>
                <InputLabel id="influencerSelect">Influencer</InputLabel>
                <Select
                    name="influencer"
                    labelId="influencerSelect"
                    label="Influencer"
                    size="medium"
                    disabled={targetAssignment !== undefined}
                    value={timelineEvent.assignment?.id ?? ""}
                    onChange={onInfluencerChange}
                    required
                >
                    {campaign.assignedInfluencers.map((assignment, i, a) => {
                        // debugger;
                        if (assignment.isPlaceholder) {
                            return (
                                <MenuItem key={`influencer${assignment.id}`} value={assignment.id}>
                                    {`Influencer ${assignment.placeholderName}`}
                                </MenuItem>
                            );
                        }
                        return (
                            <MenuItem key={`influencer${assignment.id}`} value={assignment.id}>
                                {`${assignment.influencer?.firstName} ${assignment.influencer?.lastName}`}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl> */}
        </DialogContent>
    );
}
