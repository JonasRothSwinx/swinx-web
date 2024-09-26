import { Assignments, Influencers, EmailTriggers } from "@/app/ServerFunctions/types";
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
import stylesExporter from "@/app/(main)/styles/stylesExporter";
import { dataClient } from "@/app/ServerFunctions/database";
import { useQueryClient } from "@tanstack/react-query";
import sxStyles from "./sxStyles";
import { Grid2 as Grid } from "@mui/material";
import { TextFieldWithTooltip } from "./Components";

const styles = stylesExporter.dialogs;

// type InfluencerDialogProps = DialogProps<Influencer.Full[], DialogType>;
type InfluencerDialogProps = {
    onClose?: (hasChanged?: boolean) => void;
    editing?: boolean;
    editingData?: Influencers.Full;
    parent: Influencers.Full[];
    setParent: React.Dispatch<React.SetStateAction<Influencers.Full[]>>;
    isOpen?: boolean;
};

export function InfluencerDialog(props: InfluencerDialogProps) {
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
    const [changedData, setChangedData] = useState<Partial<Influencers.Full>>({});

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
                if (!Influencers.isFull(changedData, false)) return;
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
                <FormInputs {...infoProps} />

                <DialogActions>
                    <Button
                        onClick={EventHandlers.handleClose}
                        color="secondary"
                    >
                        Abbrechen
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                    >
                        Speichern
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
interface InfoProps {
    changedData: Partial<Influencers.Full>;
    editingData?: Influencers.Full;
    setChangedData: React.Dispatch<React.SetStateAction<Partial<Influencers.Full>>>;
}

function FormInputs(props: InfoProps) {
    return (
        <Box>
            <ContactInfo {...props} />
            <IndustryInfo {...props} />
            <SocialMediaInfo {...props} />
            <Notes {...props} />
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
            <DialogContentText
                margin={"10"}
                textAlign={"center"}
            >
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
            <TextFieldWithTooltip
                select
                disabled
                id="emailType"
                name="emailType"
                className={styles.TextField}
                label="E-Mail Typ"
                type="text"
                SelectProps={{
                    value: changedData.emailLevel ?? editingData?.emailLevel ?? "new",
                    onChange: Eventhandlers.handleEmailTypeChange,
                }}
                tooltipProps={{
                    title: "Welche Email Templates werden für diesen Kontakt verwendet?",
                }}
            >
                {EmailTriggers.emailLevels.map((option) => (
                    <MenuItem
                        key={option}
                        value={option}
                    >
                        {EmailTriggers.getDisplayName(option)}
                    </MenuItem>
                ))}
            </TextFieldWithTooltip>
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
            <TextFieldWithTooltip
                id="linkedin"
                name="linkedin"
                className={styles.TextField}
                label="LinkedIn"
                type="text"
                value={changedData.linkedinProfile ?? editingData?.linkedinProfile ?? ""}
                onChange={Eventhandlers.handleLinkedinChange}
                tooltipProps={{
                    title: "LinkedIn Profil Link",
                }}
            />
            <TextFieldWithTooltip
                id="followers"
                name="followers"
                className={styles.TextField}
                label="Follower"
                type="number"
                value={changedData.followers ?? editingData?.followers ?? 0}
                onChange={Eventhandlers.handleFollowersChange}
                tooltipProps={{
                    title: "Anzahl der Followerzahl, ohne Trennzeichen",
                }}
            />
            <TextFieldWithTooltip
                id="topics"
                name="topics"
                className={styles.TextField}
                label="Themen"
                type="text"
                value={(changedData.topic ?? editingData?.topic ?? []).join(",") ?? ""}
                onChange={Eventhandlers.handleTopicsChange}
                tooltipProps={{
                    title: "Worüber postet der Influencer?\nMehrere Themen durch Komma getrennt eingeben.",
                }}
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
            <TextFieldWithTooltip
                multiline
                minRows={3}
                id="notes"
                name="notes"
                className={styles.TextField}
                label="Notizen"
                type="text"
                value={changedData.notes ?? ""}
                onChange={Eventhandlers.handleNotesChange}
                tooltipProps={{
                    title: "Notizen über den Influencer",
                }}
            />
        </DialogContent>
    );
}
