import { DialogProps } from "@/app/Definitions/types";
import Influencer from "@/app/ServerFunctions/types/influencer";
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
import React, { useState } from "react";
import stylesExporter from "../styles/stylesExporter";
import dataClient from "@/app/ServerFunctions/database";
import { useQueryClient } from "@tanstack/react-query";

const styles = stylesExporter.dialogs;
type DialogType = Influencer.Full;

type InfluencerDialogProps = DialogProps<Influencer.Full[], DialogType>;
function InfluencerDialog(props: InfluencerDialogProps) {
    // debugger;
    const {
        onClose,
        parent: rows,
        setParent: setRows,
        isOpen = true,
        editing,
        editingData,
    } = props;
    // const [isModalOpen, setIsModalOpen] = useState(open);
    const [changedData, setChangedData] = useState<Partial<Influencer.Full>>({});

    const queryClient = useQueryClient();
    const infoProps: InfoProps = { changedData, setChangedData };
    const EventHandlers = {
        handleClose: () => {
            if (onClose) {
                onClose();
            }
        },
        submitData: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            event.preventDefault();
            // debugger;
            if (editing) {
                // update
                const id = editingData?.id;
                if (!id) return;
                dataClient.influencer.update({ ...changedData, id }, editingData);
            } else {
                // create
                if (!Influencer.isFull(changedData, false)) return;
                dataClient.influencer.create(changedData);
            }
            EventHandlers.handleClose();
        },
    };

    return (
        <Dialog
            // ref={modalRef}
            open={isOpen}
            className={styles.dialog}
            onClose={EventHandlers.handleClose}
            PaperProps={{
                component: "form",
                onSubmit: EventHandlers.submitData,
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

            <ContactInfo {...infoProps} />
            <IndustryInfo {...infoProps} />
            <SocialMediaInfo {...infoProps} />
            <Notes {...infoProps} />

            <DialogActions
                sx={{
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                <Button onClick={EventHandlers.handleClose} color="secondary">
                    Abbrechen
                </Button>
                <Button variant="contained" type="submit">
                    Speichern
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default InfluencerDialog;
interface InfoProps {
    changedData: Partial<Influencer.Full>;
    setChangedData: React.Dispatch<React.SetStateAction<Partial<Influencer.Full>>>;
}

/**
 * ContactInfo
 * Fields:
 * firstName    - required,
 * lastName     - required,
 * email        - required,
 * emailType    - optional
 */
function ContactInfo(props: InfoProps) {
    const { changedData, setChangedData } = props;
    const Eventhandlers = {
        handleFirstNameChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setChangedData({ ...changedData, firstName: event.target.value });
        },
        handleLastNameChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setChangedData({ ...changedData, lastName: event.target.value });
        },
        handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setChangedData({ ...changedData, email: event.target.value });
        },
        handleEmailTypeChange: (event: SelectChangeEvent<unknown>) => {
            //target value is string
            if (!(typeof event.target.value === "string")) return;
            const emailType = event.target.value as Influencer.emailType;
            if (!Influencer.isValidEmailType(emailType)) return;
            setChangedData({ ...changedData, emailLevel: emailType });
        },
    };

    return (
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
                autoFocus
                id="firstName"
                name="firstName"
                className={styles.TextField}
                label="Vorname"
                type="text"
                value={changedData.firstName ?? ""}
                onChange={Eventhandlers.handleFirstNameChange}
                required
            />
            <TextField
                id="lastName"
                name="lastName"
                className={styles.TextField}
                label="Nachname"
                type="text"
                value={changedData.lastName ?? ""}
                onChange={Eventhandlers.handleLastNameChange}
                required
            />
            <TextField
                id="email"
                name="email"
                className={styles.TextField}
                label="E-Mail"
                type="email"
                value={changedData.email ?? ""}
                onChange={Eventhandlers.handleEmailChange}
                required
            />
            {/* Email type Selector. Possible Values come from Influencers.emailTypeValues */}
            <TextField
                select
                id="emailType"
                name="emailType"
                className={styles.TextField}
                label="E-Mail Typ"
                type="text"
                SelectProps={{
                    value: changedData.emailLevel ?? "new",
                    onChange: Eventhandlers.handleEmailTypeChange,
                }}
            >
                {Influencer.emailTypeValues.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
        </DialogContent>
    );
}

/**
 * IndustryInfo
 * Fields:
 * industry,
 * company,
 * position
 */
function IndustryInfo(props: InfoProps) {
    const { changedData, setChangedData } = props;
    const Eventhandlers = {
        handleIndustryChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setChangedData({ ...changedData, industry: event.target.value });
        },
        handleCompanyChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setChangedData({ ...changedData, company: event.target.value });
        },
        handlePositionChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setChangedData({ ...changedData, companyPosition: event.target.value });
        },
    };

    return (
        <DialogContent dividers>
            <TextField
                id="industry"
                name="industry"
                className={styles.TextField}
                label="Branche"
                type="text"
                value={changedData.industry ?? ""}
                onChange={Eventhandlers.handleIndustryChange}
            />
            <TextField
                id="company"
                name="company"
                className={styles.TextField}
                label="Firma"
                type="text"
                value={changedData.company ?? ""}
                onChange={Eventhandlers.handleCompanyChange}
            />
            <TextField
                id="position"
                name="position"
                className={styles.TextField}
                label="Position"
                type="text"
                value={changedData.companyPosition ?? ""}
                onChange={Eventhandlers.handlePositionChange}
            />
        </DialogContent>
    );
}

/**
 * SocialMediaInfo
 * Fields:
 * linkedinProfile,
 * followers
 * topics
 */
function SocialMediaInfo(props: InfoProps) {
    const { changedData, setChangedData } = props;
    const Eventhandlers = {
        handleLinkedinChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setChangedData({ ...changedData, linkedinProfile: event.target.value });
        },
        handleFollowersChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setChangedData({ ...changedData, followers: parseInt(event.target.value) });
        },
        handleTopicsChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const topics = event.target.value.split(",").map((x) => x.trim());
            setChangedData({ ...changedData, topic: topics });
        },
    };

    return (
        <DialogContent dividers>
            <TextField
                id="linkedin"
                name="linkedin"
                className={styles.TextField}
                label="LinkedIn"
                type="text"
                value={changedData.linkedinProfile ?? ""}
                onChange={Eventhandlers.handleLinkedinChange}
            />
            <TextField
                id="followers"
                name="followers"
                className={styles.TextField}
                label="Follower"
                type="number"
                value={changedData.followers ?? ""}
                onChange={Eventhandlers.handleFollowersChange}
            />
            <TextField
                id="topics"
                name="topics"
                className={styles.TextField}
                label="Themen"
                type="text"
                value={changedData.topic?.join(",") ?? ""}
                onChange={Eventhandlers.handleTopicsChange}
            />
        </DialogContent>
    );
}

/**
 * NotesInfo
 * Fields:
 * notes
 */
function Notes(props: InfoProps) {
    const { changedData, setChangedData } = props;
    const Eventhandlers = {
        handleNotesChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setChangedData({ ...changedData, notes: event.target.value });
        },
    };

    return (
        <DialogContent dividers>
            <TextField
                id="notes"
                name="notes"
                className={styles.TextField}
                label="Notizen"
                type="text"
                value={changedData.notes ?? ""}
                onChange={Eventhandlers.handleNotesChange}
            />
        </DialogContent>
    );
}
