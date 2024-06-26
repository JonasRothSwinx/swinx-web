import { DialogProps } from "@/app/Definitions/types";
import Influencer from "@/app/ServerFunctions/types/influencer";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    SelectChangeEvent,
    TextField,
} from "@mui/material";
import React, { useState } from "react";
import stylesExporter from "../styles/stylesExporter";
import dataClient from "@/app/ServerFunctions/database";
import { useQueryClient } from "@tanstack/react-query";
import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import sxStyles from "./sxStyles";
import { Unstable_Grid2 as Grid } from "@mui/material";

const styles = stylesExporter.dialogs;
type DialogType = Influencer.Full;

type InfluencerDialogProps = DialogProps<Influencer.Full[], DialogType>;
function InfluencerDialog(props: InfluencerDialogProps) {
    // debugger;
    const { onClose, parent: rows, setParent: setRows, isOpen = true, editing, editingData } = props;
    // const [isModalOpen, setIsModalOpen] = useState(open);
    const [changedData, setChangedData] = useState<Partial<Influencer.Full>>({});

    const queryClient = useQueryClient();
    const infoProps: InfoProps = { changedData, editingData, setChangedData };
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
                if (Object.entries(changedData).length === 0) {
                    console.log("No changes detected");
                } else {
                    const id = editingData?.id;
                    if (!id) return;
                    dataClient.influencer.update({ ...changedData, id }, editingData);
                }
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
            // className={styles.dialog}
            onClose={EventHandlers.handleClose}
            PaperProps={{
                component: "form",
                onSubmit: EventHandlers.submitData,
            }}
            sx={sxStyles.DialogDefault}
        >
            <Box>
                <DialogTitle>{editing ? "Influencer bearbeiten" : "Neuer Influencer"}</DialogTitle>
                {/* <button onClick={handleCloseModal}>x</button> */}
                <FormInputGrid {...infoProps} />

                <DialogActions>
                    <Button onClick={EventHandlers.handleClose} color="secondary">
                        Abbrechen
                    </Button>
                    <Button variant="contained" type="submit">
                        Speichern
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
export default InfluencerDialog;
interface InfoProps {
    changedData: Partial<Influencer.Full>;
    editingData?: Influencer.Full;
    setChangedData: React.Dispatch<React.SetStateAction<Partial<Influencer.Full>>>;
}

function FormInputGrid(props: InfoProps) {
    return (
        <Box>
            <ContactInfo {...props} />
            <IndustryInfo {...props} />
            <SocialMediaInfo {...props} />
            <Notes {...props} />
        </Box>
    );
    return (
        <Box>
            <Grid container direction={"column"}>
                <Grid>
                    <ContactInfo {...props} />
                </Grid>
                <Grid>
                    <IndustryInfo {...props} />
                </Grid>
                <Grid>
                    <SocialMediaInfo {...props} />
                </Grid>
                <Grid>
                    <Notes {...props} />
                </Grid>
            </Grid>
        </Box>
    );
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
    const { changedData, editingData, setChangedData } = props;
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
            const emailType = event.target.value as EmailTriggers.emailLevel;
            if (!EmailTriggers.isValidEmailType(emailType)) return;
            setChangedData({ ...changedData, emailLevel: emailType });
        },
    };

    return (
        <DialogContent
            // dividers
            sx={{
                "& .MuiFormControl-root": {
                    // padding: "5px",
                    margin: "5px",
                    flex: 1,
                },
                "& .MuiFormControl-root:has(#email)": { flexBasis: "100%" },
            }}
        >
            <DialogContentText margin={"10"} textAlign={"center"}>
                Kontakt
            </DialogContentText>
            <TextField
                autoFocus
                id="firstName"
                name="firstName"
                className={styles.TextField}
                label="Vorname"
                type="text"
                value={changedData.firstName ?? editingData?.firstName ?? ""}
                onChange={Eventhandlers.handleFirstNameChange}
                required
            />
            <TextField
                id="lastName"
                name="lastName"
                className={styles.TextField}
                label="Nachname"
                type="text"
                value={changedData.lastName ?? editingData?.lastName ?? ""}
                onChange={Eventhandlers.handleLastNameChange}
                required
            />
            <TextField
                id="email"
                name="email"
                className={styles.TextField}
                label="E-Mail"
                type="email"
                value={changedData.email ?? editingData?.email ?? ""}
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
                    value: changedData.emailLevel ?? editingData?.emailLevel ?? "new",
                    onChange: Eventhandlers.handleEmailTypeChange,
                }}
            >
                {EmailTriggers.emailLevels.map((option) => (
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
    const { changedData, editingData, setChangedData } = props;
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
        <DialogContent>
            <DialogContentText textAlign={"center"}>Arbeit</DialogContentText>
            <TextField
                id="industry"
                name="industry"
                className={styles.TextField}
                label="Branche"
                type="text"
                value={changedData.industry ?? editingData?.industry ?? ""}
                onChange={Eventhandlers.handleIndustryChange}
            />
            <TextField
                id="company"
                name="company"
                className={styles.TextField}
                label="Firma"
                type="text"
                value={changedData.company ?? editingData?.company ?? ""}
                onChange={Eventhandlers.handleCompanyChange}
            />
            <TextField
                id="position"
                name="position"
                className={styles.TextField}
                label="Position"
                type="text"
                value={changedData.companyPosition ?? editingData?.companyPosition ?? ""}
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
    const { changedData, editingData, setChangedData } = props;
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
        <DialogContent>
            <DialogContentText textAlign={"center"}>LinkedIn</DialogContentText>
            <TextField
                id="linkedin"
                name="linkedin"
                className={styles.TextField}
                label="LinkedIn"
                type="text"
                value={changedData.linkedinProfile ?? editingData?.linkedinProfile ?? ""}
                onChange={Eventhandlers.handleLinkedinChange}
            />
            <TextField
                id="followers"
                name="followers"
                className={styles.TextField}
                label="Follower"
                type="number"
                value={changedData.followers ?? editingData?.followers ?? 0}
                onChange={Eventhandlers.handleFollowersChange}
            />
            <TextField
                id="topics"
                name="topics"
                className={styles.TextField}
                label="Themen"
                type="text"
                value={(changedData.topic ?? editingData?.topic ?? []).join(",") ?? ""}
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
    const { changedData, editingData, setChangedData } = props;
    const Eventhandlers = {
        handleNotesChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setChangedData({ ...changedData, notes: event.target.value });
        },
    };

    return (
        <DialogContent>
            {/* <DialogContentText textAlign={"center"}>Notizen</DialogContentText> */}
            <TextField
                multiline
                minRows={3}
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
