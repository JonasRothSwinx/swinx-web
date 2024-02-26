import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ExtendButtonBase,
    FormControl,
    FormHelperText,
    Icon,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { DialogOptions, DialogConfig, DialogProps } from "@/app/Definitions/types";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Customer from "@/app/ServerFunctions/types/customer";
import Influencer from "@/app/ServerFunctions/types/influencer";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";

import { campaignTypes, influencerAssignments, timelineEventTypes, timelineEventTypesType } from "@/amplify/data/types";
import { DatePicker, DateTimePicker, LocalizationProvider, TimeClock, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import { ChangeEvent, MouseEvent, MouseEventHandler, useEffect, useState } from "react";
import dayjs, { Dayjs } from "@/app/configuredDayJs";
import {
    Add as AddIcon,
    Edit as EditIcon,
    DeleteOutlined as DeleteIcon,
    Save as SaveIcon,
    Close as CancelIcon,
} from "@mui/icons-material";
import stylesExporter from "../styles/stylesExporter";
import { timelineEvents } from "@/app/ServerFunctions/dbInterface";

const styles = stylesExporter.dialogs;
type DialogType = TimelineEvent.TimelineEvent;
const initEvent: Partial<DialogType> = {
    timelineEventType: "Generic",
};

export type TimelineEventDialogProps = DialogProps<Campaign.Campaign, DialogType> & {
    influencers: Influencer.InfluencerFull[];
    targetAssignment?: Assignment.AssignmentFull;
};
function TimelineEventDialog(props: TimelineEventDialogProps) {
    // debugger;
    const {
        onClose,
        parent: campaign,
        setParent: setCampaign,
        isOpen = true,
        editing,
        editingData,
        campaignId = "",
        targetAssignment,
    } = props;

    const [timelineEvent, setTimelineEvent] = useState<Partial<DialogType>>(
        editingData ?? { ...initEvent, campaign: { id: campaign.id } }
    );
    const [dates, setDates] = useState<{ number: number; dates: (Dayjs | null)[] }>({
        number: 1,
        dates: [editingData ? dayjs(editingData.date) : null],
    });
    const [influencers, setInfluencers] = useState(props.influencers);
    // console.log(influencers);
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

    // useEffect(() => {
    //     // console.log("applying props", props);
    //     setInfluencers(props.influencers);

    //     return () => {};
    // }, [props]);
    // const [inviteEvent, setInviteEvent] = useState<InviteEvent>();

    // const [isModalOpen, setIsModalOpen] = useState(open);

    function handleClose(hasChanged?: boolean) {
        return () => {
            if (onClose) {
                onClose(hasChanged);
            }
        };
        // setIsModalOpen(false);
    }
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // console.log(timelineEvent);
        // return;
        if (!campaign || !TimelineEvent.validate(timelineEvent)) return;
        if (editing && dates.dates[0]) {
            timelineEvent.date = dates.dates[0].toISOString();
            console.log(timelineEvent);
            timelineEvents.update(timelineEvent).then((res) => console.log(res));
            const newCampaign = {
                ...campaign,
                campaignTimelineEvents: [
                    ...campaign.campaignTimelineEvents.map((x) => (x.id === timelineEvent.id ? timelineEvent : x)),
                ],
            };
            setCampaign({ ...newCampaign });
            // setRows([...newRows]);
        } else {
            const newEvents = dates.dates
                .map((date): TimelineEvent.TimelineEvent | undefined => {
                    if (date === null) return;
                    return {
                        ...timelineEvent,
                        assignment: {
                            id: timelineEvent.assignment.id,
                            influencer: null,
                            placeholderName: timelineEvent.assignment.placeholderName,
                            isPlaceholder: timelineEvent.assignment.isPlaceholder,
                        },
                        campaign: { id: campaign.id },
                        date: date.toISOString(),
                    } satisfies TimelineEvent.TimelineEvent;
                })
                .filter((x): x is TimelineEvent.TimelineEvent => x !== undefined);
            // debugger;
            Promise.all(newEvents.map((x) => x && timelineEvents.create(x))).then((res) => console.log(newEvents, res));
            const updatedTimeline = [...campaign.campaignTimelineEvents, ...newEvents];
            console.log(updatedTimeline);
            const newCampaign: Campaign.Campaign = {
                ...campaign,
                campaignTimelineEvents: updatedTimeline,
            };
            // console.log(setCampaign);
            // debugger;
            console.log("New Events", newEvents);
            console.log("Setting new campaign");

            setCampaign({ ...newCampaign });
        }
        console.log("closing");
        handleClose(true)();
    }
    function handleAddDateClick() {
        setDates((prev) => {
            return { number: prev.number + 1, dates: [...prev.dates, null] };
        });
    }
    function handleTypeChange(e: SelectChangeEvent<unknown>) {
        const value = e.target.value as timelineEventTypesType;
        switch (value) {
            case "Invites":
                setTimelineEvent(
                    (prev) =>
                        ({
                            ...prev,
                            timelineEventType: value,

                            inviteEvent: { invites: 1000 },
                        } satisfies Partial<TimelineEvent.TimelineEventInvites>)
                );
                break;
            case "Video":
                setTimelineEvent(
                    (prev) =>
                        ({
                            ...prev,
                            timelineEventType: value,
                        } satisfies Partial<TimelineEvent.TimelineEventVideo>)
                );
                break;
            case "Post":
                setTimelineEvent(
                    (prev) =>
                        ({
                            ...prev,
                            timelineEventType: value,
                        } satisfies Partial<TimelineEvent.TimelineEventPost>)
                );
                break;
            default:
                setTimelineEvent(
                    (prev) =>
                        ({
                            ...prev,
                            timelineEventType: value,
                        } satisfies Partial<TimelineEvent.TimelineEventGeneric>)
                );
                break;
        }
    }
    function handleAssignmentChange(e: SelectChangeEvent) {
        const value = e.target.value;
        // setTimelineEvent((prev) => {
        //     const newInfluencer = influencers.find((x) => x.id === value);
        //     if (!newInfluencer) return prev;
        //     return {
        //         ...prev,
        //         influencer: newInfluencer,
        //     } satisfies TimelineEvent.TimelineEvent;
        // });
    }
    function handleRemoveDateClick(i: number) {
        return function (e: MouseEvent<HTMLButtonElement>) {
            setDates((prev) => {
                const newValue = {
                    number: prev.number - 1,
                    dates: [...prev.dates.filter((_x, index) => index !== i)],
                };
                console.log({ prev, newValue });
                return newValue;
            });
        };
    }
    function handleDateChange(index: number) {
        return function changeDate(newDate: Dayjs | null) {
            if (!newDate) return;
            setDates((prev) => ({
                ...prev,
                dates: [...prev.dates.map((x, i) => (i === index ? newDate : x))],
            }));
        };
    }

    return (
        <Dialog
            // ref={modalRef}
            open={isOpen}
            className={styles.dialog}
            onClose={handleClose(false)}
            PaperProps={{
                component: "form",
                onSubmit,
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
            <DialogTitle>{editing ? "Ereignis bearbeiten" : "Neues Ereignis"}</DialogTitle>
            {/* <button onClick={handleCloseModal}>x</button> */}

            <DialogContent dividers sx={{ "& .MuiFormControl-root": { flexBasis: "100%" } }}>
                <TextField
                    key="id"
                    id="id"
                    name="id"
                    className={styles.TextField}
                    label="ID"
                    type="text"
                    defaultValue={editingData?.id ?? "new"}
                    hidden
                />
                <TextField
                    select
                    disabled={editing}
                    name="timelineEventType"
                    label="Ereignistyp"
                    value={timelineEvent.timelineEventType}
                    size="medium"
                    required
                    SelectProps={{
                        // sx: { minWidth: "15ch" },
                        value: timelineEvent.timelineEventType,
                        onChange: handleTypeChange,
                    }}
                >
                    {timelineEventTypes.map((x, i) => {
                        return (
                            <MenuItem key={`eventtype${i}`} value={x}>
                                {x}
                            </MenuItem>
                        );
                    })}
                </TextField>
                <FormControl sx={{ margin: "5px", flex: 1, minWidth: "200px" }}>
                    <InputLabel id="influencerSelect">Influenzer</InputLabel>
                    <Select
                        name="influencer"
                        labelId="influencerSelect"
                        label="Influencer"
                        size="medium"
                        disabled={targetAssignment !== undefined}
                        value={timelineEvent.assignment?.id ?? ""}
                        onChange={handleAssignmentChange}
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
                </FormControl>
            </DialogContent>
            <DialogContent dividers sx={{ "& .MuiFormControl-root": { flexBasis: "100%", flex: 1 } }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                    <div style={{ flexBasis: "100%" }}>
                        {dates.dates.map((date, index) => {
                            return (
                                <div key={`dumb${index}`} className={styles.cellActionSplit}>
                                    <DatePicker
                                        key={`date${index}`}
                                        // closeOnSelect={false}
                                        label="Termin"
                                        name="date"
                                        value={date}
                                        onChange={handleDateChange(index)}
                                        slotProps={{
                                            textField: {
                                                required: true,
                                            },
                                        }}
                                    />
                                    {dates.number > 1 && (
                                        <Button key={`removeButton${index}`} onClick={handleRemoveDateClick(index)}>
                                            <DeleteIcon />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {!editing && (
                        <Button
                            key={"Add"}
                            aria-label="Add"
                            onClick={handleAddDateClick}
                            color="primary"
                            style={{ alignSelf: "flex-start" }}
                            variant="outlined"
                        >
                            <AddIcon />
                            An weiterem Termin wiederholen
                        </Button>
                    )}

                    {/* <TimePicker name="time" /> */}
                </LocalizationProvider>
            </DialogContent>
            {TimelineEvent.validate(timelineEvent) && TimelineEvent.isInviteEvent(timelineEvent) && (
                <>
                    <DialogContent dividers sx={{ "& .MuiFormControl-root": { flexBasis: "100%" } }}>
                        <TextField
                            type="number"
                            id="invites"
                            name="invites"
                            label="Anzahl Invites"
                            value={timelineEvent.inviteEvent?.invites}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const value: number = parseInt(e.target.value);
                                // console.log(value);
                                setTimelineEvent((prev) => {
                                    if (!TimelineEvent.validate(prev) || !TimelineEvent.isInviteEvent(prev))
                                        return prev;
                                    const newVal = {
                                        ...prev,
                                        inviteEvent: { ...prev.inviteEvent, invites: value },
                                    } satisfies TimelineEvent.TimelineEvent;
                                    console.log({ prev, newVal });
                                    return newVal;
                                });
                            }}
                            required
                        />
                    </DialogContent>
                </>
            )}

            <DialogActions
                sx={{
                    justifyContent: "space-between",
                }}
            >
                <Button onClick={handleClose(false)} color="secondary">
                    Abbrechen
                </Button>
                <Button variant="contained" type="submit">
                    Speichern
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default TimelineEventDialog;
