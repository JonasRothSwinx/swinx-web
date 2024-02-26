import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import Assignment from "@/app/ServerFunctions/types/assignment";
import Campaign from "@/app/ServerFunctions/types/campaign";
import Customer from "@/app/ServerFunctions/types/customer";
import Influencer from "@/app/ServerFunctions/types/influencer";
import TimelineEvent from "@/app/ServerFunctions/types/timelineEvents";
import { DialogOptions, DialogConfig, DialogProps } from "@/app/Definitions/types";
import stylesExporter from "../styles/stylesExporter";
import { influencers } from "@/app/ServerFunctions/dbInterface";
import { useEffect, useMemo, useState } from "react";

const styles = stylesExporter.dialogs;
type DialogType = Assignment.Assignment;

type InfluencerDialogProps = DialogProps<Campaign.Campaign, DialogType>;

function AssignmentDialog(props: InfluencerDialogProps) {
    // debugger;
    const { onClose, parent: campaign, setParent: setCampaign, isOpen = true, editing, editingData } = props;
    const defaultValue: Partial<DialogType> = useMemo(
        () => ({
            placeholderName: `Influencer ${campaign.assignedInfluencers.length + 1}`,
        }),
        [campaign]
    );
    const [assignment, setAssignment] = useState<Partial<DialogType>>(defaultValue);

    function handleClose() {
        if (onClose) {
            onClose();
        }
        // setIsModalOpen(false);
    }
    useEffect(() => {
        if (editingData) {
            setAssignment(editingData);
        } else {
            setAssignment(defaultValue);
        }

        return () => {};
    }, [editingData, defaultValue]);

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
    const Clickhandlers = {
        submit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            // debugger;
            if (!campaign) return;
            console.log(assignment);
            // const formData = new FormData(event.currentTarget);
            // const formJson = Object.fromEntries((formData as any).entries());
            // const { id, firstName, lastName, email } = formJson;
            // let updatedRows = [...rows];
            // if (editing && editingData) {
            //     const updatedInfluencer: Influencer.InfluencerFull = {
            //         ...editingData,
            //         firstName,
            //         lastName,
            //         details: { ...editingData.details, email },
            //     };
            //     updatedRows = rows.map((row) => (row.id === updatedInfluencer.id ? updatedInfluencer : row));
            //     // console.log({ rows, updatedRows });
            //     console.log("Setting Rows");

            //     influencers.update({
            //         data: {
            //             id,
            //             firstName,
            //             lastName,
            //             email,
            //         },
            //     });
            // } else {
            //     const newInfluencer: Influencer.InfluencerFull = {
            //         id: "new",
            //         firstName,
            //         lastName,
            //         createdAt: new Date().toISOString(),
            //         updatedAt: new Date().toISOString(),
            //         details: { id: "new", email },
            //     };
            //     updatedRows.push(newInfluencer);
            //     influencers.create({ data: { firstName, lastName, email } });
            // }
            // setRows && setRows(updatedRows);
            // handleClose();
        },
    };
    return (
        <Dialog
            // ref={modalRef}
            open={isOpen}
            className={styles.dialog}
            onClose={handleClose}
            PaperProps={{
                component: "form",
                onSubmit: Clickhandlers.submit,
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
                <TextField
                    id="id"
                    name="id"
                    type="text"
                    label="ID"
                    className={styles.TextField}
                    defaultValue={assignment?.id ?? ""}
                    hidden
                ></TextField>
                <TextField
                    id="name"
                    name="lastName"
                    className={styles.TextField}
                    label="Nachname"
                    type="text"
                    defaultValue={assignment.placeholderName ?? ""}
                />
                <TextField
                    id="budget"
                    name="budget"
                    className={styles.TextField}
                    label="Budget"
                    type="number"
                    defaultValue={assignment.budget ?? 0}
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
export default AssignmentDialog;
