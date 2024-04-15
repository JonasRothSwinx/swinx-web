import database from "@/app/ServerFunctions/database/dbOperations";
import Campaign from "@/app/ServerFunctions/types/campaign";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import dayjs from "@/app/utils/configuredDayJs";
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import stylesExporter from "../../../styles/stylesExporter";
import WebinarDetails from "./MultiEventDetails/WebinarDetails";
import { submitMultiEvent } from "./submitMultiEvent";

const styles = stylesExporter.dialogs;

interface timelineEventDialogProps {
    onClose: (hasChanged: boolean) => void;
    editing?: boolean;
    editingTarget?: TimelineEvent.MultiEvent;
    campaign: Campaign.Campaign;
}
export default function TimelineEventMultiDialog(props: timelineEventDialogProps) {
    const { editing, editingTarget, campaign, onClose } = props;
    const [timelineEvent, setTimelineEvent] = useState<Partial<TimelineEvent.MultiEvent>>(
        editingTarget ?? {
            type: "Webinar",
            date: dayjs().toISOString(),
            campaign: { id: campaign.id },
            eventAssignmentAmount: 1,
            assignments: [],
        },
    );

    const queryClient = useQueryClient();

    const EventHandlers = {
        handleClose: (result: boolean) => () => {
            props.onClose(result);
        },
        onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            console.log("submitting", timelineEvent);
            submitMultiEvent({
                editing: editing ?? false,
                event: timelineEvent as TimelineEvent.MultiEvent,
                campaign,
                queryClient,
                assignments: timelineEvent.assignments ?? [],
            });
            EventHandlers.handleClose(true)();
            // dbInterface.timelineEvent.create(timelineEvent as TimelineEvent.MultiEvent).then((res) => {
            //     console.log(res);
            //     EventHandlers.handleClose(true)();
            // });
            // EventHandlers.handleClose(true)();
        },
        handleTypeChange: (e: SelectChangeEvent<unknown>) => {
            const value = e.target.value;
            if (!TimelineEvent.isMultiEventType(value)) throw new Error("Invalid event type");
            setTimelineEvent((prev) => {
                return { ...prev, type: value };
            });
        },
        handleDateChange: (date: dayjs.Dayjs | null) => {
            const dateString = date?.toISOString() ?? "";
            setTimelineEvent((prev) => {
                return { ...prev, date: dateString };
            });
        },
    };

    const EventDetails: { [key in TimelineEvent.multiEventType]: JSX.Element } = {
        Webinar: (
            <WebinarDetails
                data={timelineEvent as TimelineEvent.Webinar}
                onChange={(data) => {
                    setTimelineEvent((prev) => {
                        return { ...prev, ...data };
                    });
                }}
            />
        ),
    };
    return (
        <Dialog
            // ref={modalRef}
            open={true}
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
                    defaultValue={timelineEvent?.id ?? "new"}
                    hidden
                />
                <TextField
                    select
                    disabled={editing}
                    name="timelineEventType"
                    label="Ereignistyp"
                    value={timelineEvent.type ?? "Webinar"}
                    size="medium"
                    required
                    SelectProps={{
                        // sx: { minWidth: "15ch" },
                        value: timelineEvent.type ?? "Webinar",
                        onChange: EventHandlers.handleTypeChange,
                    }}
                >
                    {TimelineEvent.multiEventValues.map((x, i) => {
                        return (
                            <MenuItem key={`eventtype${i}`} value={x}>
                                {x}
                            </MenuItem>
                        );
                    })}
                </TextField>
            </DialogContent>
            <DialogContent
                dividers
                sx={{ "& .MuiFormControl-root": { flexBasis: "100%", flex: 1 } }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                    <DatePicker
                        // closeOnSelect={false}
                        label="Termin"
                        name="date"
                        value={dayjs(timelineEvent.date)}
                        onChange={EventHandlers.handleDateChange}
                        slotProps={{
                            textField: {
                                required: true,
                            },
                        }}
                    />

                    {/* <TimePicker name="time" /> */}
                </LocalizationProvider>
            </DialogContent>

            {EventDetails[timelineEvent.type as TimelineEvent.multiEventType] ?? <></>}

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
