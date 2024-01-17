import { useEffect, useRef, useState } from "react";
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

const client = generateClient<Schema>();

function CreateInfluencerDialog(props: { open: boolean; onClose: () => any }) {
    const { open, onClose } = props;
    const [isModalOpen, setIsModalOpen] = useState(open);
    // const modalRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     setIsModalOpen(open);
    // }, [open]);

    // useEffect(() => {
    //     const modalElement = modalRef.current;
    //     if (modalElement) {
    //         if (isModalOpen) {
    //             modalElement.showModal();
    //         } else {
    //             modalElement.close();
    //         }
    //     }
    // }, [isModalOpen]);

    function handleClose() {
        if (onClose) {
            onClose();
        }
        // setIsModalOpen(false);
    }

    async function makeInfluencer(args: { firstName: string; lastName: string; email: string }) {
        const { firstName, lastName, email } = args;
        console.log({ firstName, lastName, email });
        if (!(firstName && lastName && email)) {
            return;
        }
        const { data: privateData } = await client.models.InfluencerPrivate.create({
            email,
        });
        const { data: newPublicInfluencer } = await client.models.InfluencerPublic.create({
            firstName,
            lastName,
            details: privateData,
        });
        // console.log({ newPublicInfluencer });
        // console.log(data.get("firstName"), data.get("lastName"),data.);
        handleClose();
    }

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
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());
                    const { firstName, lastName, email } = formJson;
                    makeInfluencer({ firstName, lastName, email });
                    handleClose();
                },
            }}
            sx={{
                "& .MuiDialogContent-root": {
                    width: "520px",
                },
            }}
        >
            <DialogTitle>Neuer Influencer</DialogTitle>
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
                <TextField
                    autoFocus
                    id="firstName"
                    name="firstName"
                    className={styles.TextField}
                    label="Vorname"
                    type="text"
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
export default CreateInfluencerDialog;
