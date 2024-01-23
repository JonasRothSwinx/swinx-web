import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./influencerMenu.module.css";
import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { createNewInfluencer, updateInfluencer } from "@/app/ServerFunctions/serverActions";
import { DialogOptions, DialogProps, RowDataInfluencer } from "@/app/Definitions/types";

const client = generateClient<Schema>();
type DialogType = RowDataInfluencer;

function CreateInfluencerDialog(props: DialogProps<DialogType> & DialogOptions<DialogType>) {
    const {
        open = false,
        onClose,
        editing,
        editingData,
        rows,
        setRows,
        columns,
        excludeColumns,
    } = props;
    // const [isModalOpen, setIsModalOpen] = useState(open);

    function handleClose() {
        if (onClose) {
            onClose();
        }
        // setIsModalOpen(false);
    }

    // async function makeInfluencer(args: { firstName: string; lastName: string; email: string }) {
    //     const { firstName, lastName, email } = args;
    //     console.log({ firstName, lastName, email });
    //     if (!(firstName && lastName && email)) {
    //         return;
    //     }
    //     const { data: privateData } = await client.models.InfluencerPrivate.create({
    //         email,
    //     });
    //     const { data: newPublicInfluencer } = await client.models.InfluencerPublic.create({
    //         firstName,
    //         lastName,
    //         details: privateData,
    //     });
    //     // console.log({ newPublicInfluencer });
    //     // console.log(data.get("firstName"), data.get("lastName"),data.);
    //     handleClose();
    // }

    return (
        <Dialog
            // ref={modalRef}
            open={open}
            className={styles.dialog}
            onClose={handleClose}
            PaperProps={{
                component: "form",
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    // debugger;
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());
                    const { id, firstName, lastName, email } = formJson;
                    if (editing && editingData) {
                        const updatedInfluencer = { ...editingData };
                        updatedInfluencer.email = email;
                        updatedInfluencer.firstName = firstName;
                        updatedInfluencer.lastName = lastName;
                        updatedInfluencer.email = email;
                        const updatedRows = rows.map((row) =>
                            row.id === updatedInfluencer.id ? updatedInfluencer : row,
                        );
                        console.log({ rows, updatedRows });
                        setRows(updatedRows);

                        updateInfluencer({
                            data: {
                                id,
                                firstName,
                                lastName,
                                email,
                            },
                        });
                    } else {
                        createNewInfluencer({ data: { firstName, lastName, email } });
                    }
                    handleClose();
                },
            }}
            sx={{
                "& .MuiDialogContent-root": {
                    width: "520px",
                },
            }}
        >
            <DialogTitle>{editing ? "Influencer bearbeiten" : "Neuer Influencer"}</DialogTitle>
            {/* <button onClick={handleCloseModal}>x</button> */}
            <DialogContent
                dividers
                sx={{
                    "& .MuiFormControl-root": {
                        // padding: "5px",
                        margin: "5px",
                        flex: 1,
                    },
                }}
            >
                {columns.map((column, idx) => {
                    const { field, headerName: label, type: colType } = column;
                    const hidden = excludeColumns.includes(field);
                    const required = !hidden;
                    // console.log({ field, hidden });
                    if (field === "actions") return null;
                    let fieldType = "text";
                    switch (colType) {
                        case "email":
                            fieldType = "email";
                            break;
                        default:
                            break;
                    }
                    let defaultValue = "";
                    if (editing && editingData) {
                        const prop = field as keyof typeof editingData;
                        defaultValue = editingData[prop]?.toString() ?? "";
                    }

                    return (
                        <TextField
                            // hiddenLabel={hidden}
                            key={idx}
                            autoFocus={idx === 0}
                            required={required}
                            id={field}
                            name={field}
                            className={styles.TextField}
                            label={label}
                            type={fieldType}
                            defaultValue={defaultValue}
                            hidden={hidden}
                        />
                    );
                })}
                {/* <TextField
                    autoFocus
                    id="firstName"
                    name="firstName"
                    className={styles.TextField}
                    label="Vorname"
                    type="text"
                    defaultValue={editingData?.firstName?.toString() ?? ""}
                    required
                />
                <TextField
                    id="lastName"
                    name="lastName"
                    className={styles.TextField}
                    label="Nachname"
                    type="text"
                    required
                />
                <TextField
                    id="email"
                    name="email"
                    className={styles.TextField}
                    label="E-Mail"
                    type="email"
                    required
                /> */}
                <Button type="submit" />
                <DialogActions
                    sx={{
                        justifyContent: "space-between",
                    }}
                >
                    <Button onClick={handleClose} color="secondary">
                        Abbrechen
                    </Button>
                    <Button variant="contained" type="submit">
                        Speichern
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}
export default CreateInfluencerDialog;
