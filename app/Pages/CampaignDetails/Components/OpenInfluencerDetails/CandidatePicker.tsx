import Assignment from "@/app/ServerFunctions/types/assignment";
import { Box, Button, Dialog, Skeleton, Typography } from "@mui/material";
import { randomAddress } from "@mui/x-data-grid-generator";
import Grid from "@mui/material/Unstable_Grid2";
import Influencer from "@/app/ServerFunctions/types/influencer";
import { useEffect, useMemo, useState } from "react";
import { listInfluencers } from "@/app/ServerFunctions/database/influencers";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
    GridToolbar,
    GridToolbarProps,
    GridToolbarQuickFilter,
    GridToolbarQuickFilterProps,
} from "@mui/x-data-grid";
import dbInterface from "@/app/ServerFunctions/dbInterface";
import { getUserGroups } from "@/app/ServerFunctions/serverActions";
import { group } from "console";
import emailClient from "@/app/ServerFunctions/email/emailClient";
import stylesExporter from "@/app/Pages/styles/stylesExporter";
import { Nullable } from "@/app/Definitions/types";
import EmailPreview from "../EmailPreview/EmailPreview";

// eslint-disable-next-line
interface CandidatePickerProps {
    influencers: Influencer.InfluencerFull[];
    assignment: Assignment.Assignment;
    setAssignment: (assignment: Assignment.Assignment, updatedValues?: Partial<Assignment.Assignment>) => void;
    onClose: () => void;
}
function getClassByResponse(response: Nullable<string>) {
    switch (response) {
        case "accepted": {
            return stylesExporter.campaignDetails.green;
        }
        case "pending": {
            return stylesExporter.campaignDetails.yellow;
        }
        case "rejected": {
            return stylesExporter.campaignDetails.red;
        }
        default: {
            return "";
        }
    }
}
type openDialog = "none" | "emailPreview";
export default function CandidatePicker(props: CandidatePickerProps) {
    const { assignment, setAssignment, influencers } = props;
    function setSelectedCandidates(candidates: Influencer.Candidate[]) {
        const newAssignment: Assignment.Assignment = { ...assignment, candidates: candidates };
        // console.log(newAssignment);
        // return;
        setAssignment(newAssignment, { candidates });
    }
    const [openDialog, setOpenDialog] = useState<openDialog>("none");
    const EventHandlers = {
        dialogClose: () => {
            setOpenDialog("none");
        },
    };
    const dialogs: { [state in openDialog]: JSX.Element | null } = {
        none: null,
        emailPreview: (
            <EmailPreview
                onClose={EventHandlers.dialogClose}
                templateName="CampaignInvite"
                variables={{ honorar: "0.50€", assignments: "Krebs heilen\nWeltfrieden sichern" }}
                influencers={assignment.candidates}
            />
        ),
    } as const;
    return (
        <Dialog open onClose={props.onClose} fullWidth sx={{ margin: "0", "& .MuiPaper-root": { maxWidth: "75%" } }}>
            <>{dialogs[openDialog]}</>
            <Grid container sx={{ maxHeight: "90vh", overflow: "hidden" }}>
                <Grid xs={8} sx={{ "&": { maxHeight: "90vh", overflowY: "auto" } }}>
                    <InfluencerPicker
                        influencers={influencers}
                        assignmentId={assignment.id}
                        candidates={assignment.candidates ?? []}
                        setSelectedInfluencers={setSelectedCandidates}
                    />
                </Grid>
                <Grid xs={4} sx={{ padding: "10px" }}>
                    <CandidateList candidates={assignment.candidates ?? []} />
                    <Buttons setOpenDialog={setOpenDialog} candidates={assignment.candidates ?? []} />
                </Grid>
            </Grid>
        </Dialog>
    );
}

interface CandidateListProps {
    candidates: Influencer.Candidate[];
}
function CandidateList(props: CandidateListProps) {
    const { candidates } = props;
    return (
        <div style={{ width: "100%" }}>
            <Grid container columns={2} width={"100%"}>
                <Grid xs={1}>Name</Grid>
                <Grid xs={1}>Antwort</Grid>
            </Grid>
            {candidates.map((candidate) => {
                return (
                    <Grid container columns={2} key={candidate.influencer.id}>
                        <Grid xs={1}>
                            <Typography>{`${candidate.influencer.firstName} ${candidate.influencer.lastName}`}</Typography>
                        </Grid>

                        <Grid xs={1}>
                            <Typography className={getClassByResponse(candidate.response)}>
                                {`${candidate.response}`}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            })}
        </div>
    );
}
interface InfluencerPickerProps {
    assignmentId: string;
    candidates: Influencer.Candidate[];
    influencers: Influencer.InfluencerFull[];
    setSelectedInfluencers: (influencers: Influencer.Candidate[]) => void;
}
function InfluencerPicker(props: InfluencerPickerProps) {
    const { influencers } = props;
    // const [influencers, setInfluencers] = useState<Influencer.InfluencerFull[]>();
    const [isLoading, setIsLoading] = useState(false);
    // useEffect(() => {
    //     if (!influencers) {
    //         setIsLoading(true);
    //     }
    //     listInfluencers().then((result) => {
    //         setIsLoading(false);
    //         setInfluencers(result);
    //     });

    //     return () => {};
    // }, []);

    useEffect(() => {
        const selected = props.candidates.map((x) => x.influencer.id);
        setRowSelectionModel(selected);
        return () => {};
    }, [props.candidates]);

    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const columns: GridColDef[] = [
        // {
        //     field: "id",
        //     headerName: "ID",
        //     // width: 100,
        //     // flex: 1,
        //     type: "string",
        // },
        {
            field: "name",
            headerName: "Name",
            maxWidth: 300,
            flex: 1,
            minWidth: 100,
            type: "string",
            valueGetter({ row }: { row: Influencer.InfluencerFull }) {
                // console.log(params);
                return `${row.firstName} ${row.lastName}`;
            },
        },
    ];
    const Eventhandlers = {
        selectionChange: (selected: GridRowSelectionModel) => {
            setRowSelectionModel(selected);
            const selectedInfluencers = influencers?.filter((influencer) => selected.includes(influencer.id)) ?? [];

            const removedInfluencers = props.candidates.filter((x) => !selected.includes(x.influencer.id));

            removedInfluencers.map((x) => dbInterface.candidate.delete(x));

            const addedInfluencers = selected.filter(
                (x) => !props.candidates.find((candidate) => candidate.influencer.id === x)
            );

            console.log({ selectedInfluencers, removedInfluencers, addedInfluencers });
            // return;
            const candidates: Influencer.Candidate[] = props.candidates.filter(
                (candidate) =>
                    !removedInfluencers.find((influencer) => influencer.influencer.id === candidate.influencer.id)
            );

            const newCandidates = (influencers ?? [])
                .filter((x) => addedInfluencers.includes(x.id))
                .map((influencer) => {
                    const candidate: Influencer.Candidate = {
                        influencer,
                        id: "",
                        response: "pending",
                    };
                    return candidate;
                });
            console.log({ remainingCandidates: candidates, newCandidates });
            if (removedInfluencers.length > 0) {
                Promise.all(
                    removedInfluencers.map((candidate) => {
                        console.log("deleting", candidate);
                        return dbInterface.candidate.delete(candidate).then((res) => console.log(res));
                    })
                );
            }
            if (addedInfluencers.length > 0) {
                Promise.all(newCandidates.map((x) => dbInterface.candidate.create(x, props.assignmentId))).then(
                    (res) => {
                        const idPairs = res.map((data) => data.data);
                        const updatedCandidates = idPairs.map((x) => {
                            const updated = newCandidates.find(
                                (candidate) => candidate.influencer.id === x.influencerId
                            );
                            return { ...updated, id: x.id };
                        }) as Influencer.Candidate[];
                        const newValues = [...candidates.filter((x) => x.id !== null), ...updatedCandidates];
                        console.log({ candidates, filtered: candidates.filter((x) => x.id !== null) });
                        console.log({ newValues });
                        props.setSelectedInfluencers(newValues);
                    }
                );
            }
            console.log(newCandidates);
            props.setSelectedInfluencers([...candidates, ...newCandidates]);
        },
    };
    return (
        <>
            {isLoading ? (
                <Skeleton height={600} width={400} variant="rounded" />
            ) : (
                <DataGrid
                    columns={columns}
                    rows={influencers ?? []}
                    checkboxSelection
                    slots={{ toolbar: GridToolbarQuickFilter }}
                    slotProps={{
                        toolbar: {
                            // showQuickFilter: true,
                        },
                    }}
                    rowSelectionModel={rowSelectionModel}
                    onRowSelectionModelChange={Eventhandlers.selectionChange}
                ></DataGrid>
            )}
        </>
    );
}
interface ButtonProps {
    candidates: Influencer.Candidate[];
    setOpenDialog: (dialog: openDialog) => void;
}
function Buttons(props: ButtonProps) {
    const [userGroups, setUserGroups] = useState<string[]>([]);
    useEffect(() => {
        getUserGroups().then((groups) => {
            setUserGroups(groups);
            console.log(groups);
        });

        return () => {
            setUserGroups([]);
        };
    }, []);

    const Clickhandlers = {
        openPreview: () => {
            props.setOpenDialog("emailPreview");
        },
        send: async () => {
            // const response = await sendTestMail();
            // const response = await sendTestTemplate();
            const response = await emailClient.invites.sendBulk({ candidates: props.candidates });
            console.log(response);
        },
    };

    return (
        <div style={{ position: "absolute", bottom: "0", right: "0" }}>
            {/* {userGroups.includes("admin") && <Button onClick={updateTemplates}>UpdateTemplates</Button>} */}
            <Button onClick={Clickhandlers.openPreview}>Anfrage verfassen</Button>
        </div>
    );
}
