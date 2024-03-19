import {
    Dialog,
    Typography,
    Button,
    DialogTitle,
    DialogContent,
    TextField,
    MenuItem,
    SelectChangeEvent,
    DialogActions,
} from "@mui/material";
import stylesExporter from "../../styles/stylesExporter";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { useState } from "react";
import StaticEvent from "@/app/ServerFunctions/types/staticEvents";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "@/app/configuredDayJs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import WebinarDetails from "./EventDetails/WebinarDetails";
import dbInterface from "@/app/ServerFunctions/dbInterface";

const styles = stylesExporter.dialogs;

interface StaticEventDialogProps {
    onClose: () => void;
    editing?: boolean;
    editingTarget?: StaticEvent.StaticEvent;
    campaignId: string;
}
export default function StaticEventDialog(props: StaticEventDialogProps) {
    const { editing, editingTarget } = props;
    const [staticEvent, setStaticEvent] = useState<Partial<StaticEvent.StaticEvent>>(
        editingTarget ?? {
            type: "Webinar",
            date: dayjs().toISOString(),
            campaign: { id: props.campaignId },
        },
    );

    const EventHandlers = {
        handleClose: (result: boolean) => () => {
            props.onClose();
        },
        onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            console.log("submitting");
            console.log(staticEvent);
            dbInterface.staticEvent.create(staticEvent as StaticEvent.StaticEvent);
            EventHandlers.handleClose(true)();
        },
        handleTypeChange: (e: SelectChangeEvent<unknown>) => {
            const value = e.target.value as StaticEvent.eventType;
            setStaticEvent((prev) => {
                return { ...prev, type: value };
            });
        },
        handleDateChange: (date: dayjs.Dayjs | null) => {
            const dateString = date?.toISOString() ?? "";
            setStaticEvent((prev) => {
                return { ...prev, date: dateString };
            });
        },
    };

    const EventDetails: { [key in StaticEvent.eventType]: JSX.Element } = {
        Webinar: (
            <WebinarDetails
                data={staticEvent as StaticEvent.Webinar}
                onChange={(data) => {
                    setStaticEvent((prev) => {
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
                    defaultValue={staticEvent?.id ?? "new"}
                    hidden
                />
                <TextField
                    select
                    disabled={editing}
                    name="timelineEventType"
                    label="Ereignistyp"
                    value={staticEvent.type ?? "Webinar"}
                    size="medium"
                    required
                    SelectProps={{
                        // sx: { minWidth: "15ch" },
                        value: staticEvent.type ?? "Webinar",
                        onChange: EventHandlers.handleTypeChange,
                    }}
                >
                    {StaticEvent.eventValues.map((x, i) => {
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
                        value={dayjs(staticEvent.date)}
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

            {EventDetails[staticEvent.type as StaticEvent.eventType] ?? <></>}

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
