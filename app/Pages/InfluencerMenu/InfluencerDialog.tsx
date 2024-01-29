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
import {
    Influencer,
    createNewInfluencer,
    updateInfluencer,
} from "@/app/ServerFunctions/serverActions";
import { DialogOptions, DialogProps } from "@/app/Definitions/types";

const client = generateClient<Schema>();
type DialogType = Influencer;

function InfluencerDialog(props: DialogProps<DialogType> & DialogOptions<DialogType>) {
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
                    let updatedRows = [...rows];
                    if (editing && editingData) {
                        const updatedInfluencer: Influencer = {
                            ...editingData,
                            firstName,
                            lastName,
                            details: { ...editingData.details, email },
                        };
                        updatedRows = rows.map((row) =>
                            row.id === updatedInfluencer.id ? updatedInfluencer : row,
                        );
                        // console.log({ rows, updatedRows });
                        console.log("Setting Rows");

                        updateInfluencer({
                            data: {
                                id,
                                firstName,
                                lastName,
                                email,
                            },
                        });
                    } else {
                        const newInfluencer: Influencer = {
                            id: "new",
                            firstName,
                            lastName,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            details: { id: "new", email },
                        };
                        updatedRows.push(newInfluencer);
                        createNewInfluencer({ data: { firstName, lastName, email } });
                    }
                    setRows(updatedRows);
                    handleClose();
                },
            }}
            sx={{
                "& .MuiDialogContent-root": {
                    maxWidth: "80vw",
                    display: "flex",
                    flexWrap: "wrap",
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
                    "& .MuiFormControl-root:has(#email)": { flexBasis: "100%" },
                }}
            >
                {/* {columns.map((column, idx) => {
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
                })} */}
                <TextField
                    id="id"
                    name="id"
                    type="text"
                    label="ID"
                    className={styles.TextField}
                    defaultValue={editingData?.id ?? ""}
                    hidden
                ></TextField>
                <TextField
                    autoFocus
                    id="firstName"
                    name="firstName"
                    className={styles.TextField}
                    label="Vorname"
                    type="text"
                    defaultValue={editingData?.firstName ?? ""}
                    required
                />
                <TextField
                    id="lastName"
                    name="lastName"
                    className={styles.TextField}
                    label="Nachname"
                    type="text"
                    defaultValue={editingData?.lastName ?? ""}
                    required
                />
                <TextField
                    id="email"
                    name="email"
                    className={styles.TextField}
                    label="E-Mail"
                    type="email"
                    defaultValue={editingData?.details.email ?? ""}
                    required
                />
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
export default InfluencerDialog;
