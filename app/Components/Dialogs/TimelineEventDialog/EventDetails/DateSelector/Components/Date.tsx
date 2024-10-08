import { DeleteIcon } from "@/app/Definitions/Icons";
import { Event, Events } from "@/app/ServerFunctions/types";
import { Tooltip, Button, Box, SxProps } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { dayjs, Dayjs } from "@/app/utils";
import { useMemo } from "react";

export interface DateProps {
    date: Dayjs | null;
    index: number;
    handleDateChange: (index: number, newDate: Dayjs | null) => void;
    isEditing: boolean;
    isFixedDate: boolean;
    fixedDate: Dayjs | null;
    showDeleteButton?: boolean;
    removeDate: (index: number) => void;
    parentEvent: Event | null;
}
export function Date(props: DateProps) {
    const {
        date,
        index,
        handleDateChange,
        isEditing,
        isFixedDate,
        fixedDate,
        showDeleteButton,
        removeDate,
        parentEvent,
    } = props;
    const value = useMemo(() => {
        if (isEditing) return date;
        if (isFixedDate) return fixedDate;
        return date;
    }, [date, fixedDate, isEditing, isFixedDate]);

    const maxDate = useMemo(() => {
        if (parentEvent) return dayjs(parentEvent.date);
        return dayjs().add(5000, "year");
    }, [parentEvent]);
    const minDate = useMemo(() => {
        return dayjs();
    }, []);
    const sx: SxProps = {
        maxHeight: "min-content",
        ".MuiFormControl-root": {
            ".MuiInputBase-root": {
                maxHeight: "20px",
            },
            ".MuiFormLabel-root": {
                // transform: "translate(0, 10px) scale(1)",
            },
        },
    };
    return (
        <Tooltip
            title={
                isFixedDate
                    ? "Dieser Ereignistyp findet am Datum des Webinars statt."
                    : "Wannn soll dieses Ereignis stattfinden?"
            }
            placement="top-start"
        >
            <Box
                className={"cellActionSplit"}
                sx={sx}
            >
                <DateTimePicker
                    disabled={isFixedDate}
                    // closeOnSelect={false}
                    label="Termin"
                    name="date"
                    value={value}
                    onChange={(value) => {
                        console.log("onChange", value?.toString());
                        handleDateChange(index, value);
                    }}
                    maxDate={maxDate}
                    minDate={minDate}
                    onError={(error) => {
                        console.log({ error });
                    }}
                    slotProps={{
                        textField: {
                            required: true,
                            variant: "standard",
                            InputLabelProps: {
                                shrink: true,
                            },
                        },
                    }}
                />
                {showDeleteButton && (
                    <Button
                        key={`removeButton${index}`}
                        onClick={() => {
                            console.log("removeDate", index);
                            // removeDate(index);
                        }}
                    >
                        <DeleteIcon />
                    </Button>
                )}
            </Box>
        </Tooltip>
    );
}
