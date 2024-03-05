import stylesExporter from "@/app/Pages/styles/stylesExporter";
import dbInterface from "@/app/ServerFunctions/dbInterface";
import emailClient from "@/app/ServerFunctions/email/emailClient";
import { inviteTemplateVariables } from "@/app/ServerFunctions/email/templates/invites/invitesTemplate";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { Box, CircularProgress, Dialog, MenuItem, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import parse from "html-react-parser";
import { useEffect, useState } from "react";

interface EmailPreviewProps<TemplateVariableType> {
    onClose: () => void;
    templateName: string;
    variables: Partial<TemplateVariableType>;
    influencers: Influencer.Candidate[];
}
export default function EmailPreview(props: EmailPreviewProps<inviteTemplateVariables>) {
    const [emailPreview, setEmailPreview] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [variables, setVariables] = useState({ ...props.variables });
    const [selectedInfluencer, setSelectedInfluencer] = useState(props.influencers[0]);
    useEffect(() => {
        setIsLoading(true);
        emailClient.templates.get(props.templateName).then((result) => {
            setIsLoading(false);
            setEmailPreview(result.TemplateContent?.Html);
        });

        return () => {};
    }, [props.templateName]);

    return (
        <Dialog
            open
            onClose={props.onClose}
            fullWidth
            sx={{ margin: "0", "& .MuiPaper-root": { maxWidth: "75%", height: "50vh", overflow: "hidden" } }}
        >
            <Grid container sx={{ width: "100%", height: "100%" }}>
                <Grid xs={4}>
                    {isLoading && <CircularProgress />}
                    {!isLoading && <EmailFrame emailPreview={emailPreview ?? ""} variables={variables} />}
                </Grid>
                <Grid xs={8}>
                    <Editor candidates={props.influencers} selectedCandidate={selectedInfluencer} />
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
        out = out.replaceAll(`{{${key}}}`, value);
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
    candidates: Influencer.Candidate[];
}
function Editor(props: EditorProps) {
    return (
        <Box width={"100%"} padding={"10px"}>
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
                    onChange: (e) => {
                        console.log(e);
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
