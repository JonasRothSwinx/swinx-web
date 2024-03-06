import { RefreshIcon } from "@/app/Definitions/Icons";
import stylesExporter from "@/app/Pages/styles/stylesExporter";
import dbInterface from "@/app/ServerFunctions/dbInterface";
import emailClient from "@/app/ServerFunctions/email/emailClient";
import { inviteTemplateVariables } from "@/app/ServerFunctions/email/templates/invites/invitesTemplate";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import Influencer from "@/app/ServerFunctions/types/influencer";
import {
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Dialog,
    IconButton,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useMemo, useState } from "react";

interface GetTemplateProps {
    setIsLoading: (value: boolean) => void;
    setEmailPreview: (value?: string) => void;
    templateName: string;
}

function getTemplate(props: GetTemplateProps) {
    props.setIsLoading(true);
    emailClient.templates.get(props.templateName).then((result) => {
        props.setIsLoading(false);
        props.setEmailPreview(result.TemplateContent?.Html);
    });
}
interface EmailPreviewProps<TemplateVariableType> {
    onClose: () => void;
    templateName: string;
    variables: Partial<TemplateVariableType>;
    candidates: Influencer.Candidate[];
}
export default function EmailPreview(props: EmailPreviewProps<inviteTemplateVariables>) {
    const [emailPreview, setEmailPreview] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [variables, setVariables] = useState({ ...props.variables });
    const [selectedCandidate, setSelectedCandidate] = useState(props.candidates[0]);
    const [groups, setGroups] = useState<string[]>([]);

    useEffect(() => {
        getUserGroups().then((result) => setGroups(result));

        return () => {
            setGroups([]);
        };
    }, []);

    useEffect(() => {
        getTemplate({
            setIsLoading,
            setEmailPreview,
            templateName: "CampaignInvite",
        });
        return () => {};
    }, [props.templateName]);
    useEffect(() => {
        setVariables((prev) => {
            return {
                ...prev,
                name: `${selectedCandidate.influencer.firstName} ${selectedCandidate.influencer.lastName}`,
            };
        });

        return () => {};
    }, [selectedCandidate]);

    const EventHandlers = {
        sendEmail: () => {
            emailClient.invites.sendBulk({ candidates: props.candidates, variables });
        },
        cancel: () => {
            props.onClose();
        },
    };
    return (
        <Dialog
            open
            onClose={props.onClose}
            fullWidth
            sx={{
                margin: "0",
                "& .MuiPaper-root": { maxWidth: "75%", height: "50vh", overflow: "hidden" },
            }}
        >
            <Grid container sx={{ width: "100%", height: "100%" }}>
                <Grid xs={4}>
                    {
                        <IconButton
                            onClick={() =>
                                getTemplate({
                                    setIsLoading,
                                    setEmailPreview,
                                    templateName: "CampaignInvite",
                                })
                            }
                            sx={{
                                position: "absolute",

                                animationPlayState: "running",
                                animationName: "spin",
                                animationDuration: "500ms",
                                animationIterationCount: `${isLoading ? "infinite" : "0"}`,
                                animationTimingFunction: "linear",
                                "@keyframes spin": {
                                    "100%": { transform: `rotate(360deg)` },
                                },
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    }
                    {isLoading ? (
                        <Box
                            justifyContent={"center"}
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"center"}
                            height={"100%"}
                        >
                            <Typography>Lade Email-Template</Typography>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <EmailFrame emailPreview={emailPreview ?? ""} variables={variables} />
                        </>
                    )}
                </Grid>
                <Grid xs={8} display={"flex"} flexDirection={"column"}>
                    <Editor
                        candidates={props.candidates}
                        selectedCandidate={selectedCandidate}
                        setSelectedCandidate={setSelectedCandidate}
                    />
                    <ButtonGroup
                        sx={{
                            // position: "absolute",
                            // right: "5px",
                            // bottom: "5px",
                            justifyContent: "flex-end",
                            padding: "5px",
                        }}
                    >
                        <Button onClick={EventHandlers.cancel} color="error">
                            Abbrechen
                        </Button>
                        <Button onClick={EventHandlers.sendEmail}>Emails verschicken</Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </Dialog>
    );
}
interface EmailFrameProps {
    emailPreview: string;
    variables: Partial<inviteTemplateVariables>;
}
function replaceVariables(template: string, variables: Partial<inviteTemplateVariables>) {
    let out = template;
    Object.entries(variables).forEach(([key, value]) => {
        if (typeof value === "string") {
            out = out.replaceAll(`{{${key}}}`, value);
        } else if (Array.isArray(value)) {
            const regex = new RegExp(`(?:{{#each ${key}}})(.*?){{/each}}`, "gs");
            const matches = regex.exec(out);
            if (!matches) return;
            const replacementSection = matches[0];
            const targetSection = matches[1].trim();
            // console.log({ replacementSection, targetSection });

            const replacementContent = value
                .map((x) => {
                    return Object.entries(x).map(([subkey, subvalue]) => {
                        const modified = targetSection.replaceAll(`{{${subkey}}}`, subvalue);
                        return modified;
                    });
                })
                .join("\n");
            out = out.replaceAll(replacementSection, replacementContent);
        }
        // console.log(key, value, out);
    });
    return out;
}

function EmailFrame(props: EmailFrameProps) {
    return (
        <iframe
            className={stylesExporter.campaignDetails.emailPreviewIframe}
            srcDoc={replaceVariables(props.emailPreview ?? "", props.variables)}
        ></iframe>
    );
}

interface EditorProps {
    selectedCandidate: Influencer.Candidate;
    setSelectedCandidate: (candidate: Influencer.Candidate) => void;
    candidates: Influencer.Candidate[];
}
function Editor(props: EditorProps) {
    return (
        <Box flex={1} padding={"10px"}>
            <TextField
                fullWidth
                select
                name="influencer"
                label="Zeige für Influencer'"
                value={props.selectedCandidate.id}
                size="medium"
                required
                SelectProps={{
                    // sx: { minWidth: "15ch" },
                    value: props.selectedCandidate.id,
                    onChange: ({ target: { value } }) => {
                        console.log(value);
                        const candidate = props.candidates.find((x) => x.id === value);
                        if (!candidate) return;
                        props.setSelectedCandidate(candidate);
                    },
                }}
            >
                {props.candidates.map((candidate, i) => {
                    return (
                        <MenuItem key={candidate.id ?? ""} value={candidate.id ?? ""}>
                            {`${candidate.influencer.firstName} ${candidate.influencer.lastName}`}
                        </MenuItem>
                    );
                })}
            </TextField>
        </Box>
    );
}
