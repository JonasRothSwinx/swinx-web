import { Campaign, Customer, Influencer, TimelineEvent } from "@/app/ServerFunctions/databaseTypes";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    Unstable_Grid2 as Grid,
    IconButton,
} from "@mui/material";
import TimelineView from "../Timeline/TimeLineView";
import {
    CloseFullscreen as CloseFullscreenIcon,
    Close as CloseIcon,
    ExpandMore as ExpandMoreIcon,
    Mail as MailIcon,
} from "@mui/icons-material";
import { TimelineEventDialogProps } from "../Dialogs/TimelineEventDialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DialogConfig, DialogOptions } from "@/app/Definitions/types";

interface TimelineViewExpandedProps {
    isOpen: boolean;
    campaignRows: Campaign.Campaign[];
    setRows: Dispatch<SetStateAction<Campaign.Campaign[] | undefined>>;
    campaign: Campaign.Campaign;
    influencers: Influencer.InfluencerWithName[];
    onClose: () => void;
}

function CampaignDetails(props: TimelineViewExpandedProps) {
    const { isOpen, campaign, influencers, onClose, campaignRows, setRows: setCampaigns } = props;
    const [dialogOptions, setDialogOptions] = useState<DialogOptions>({});
    const [dialogConfig, setDialogConfig] = useState<DialogConfig<Campaign.Campaign>>({
        rows: campaignRows ?? [],
        setRows: setCampaigns,
        onClose: onDialogClose,
    });
    function onDialogClose() {}
    function handleClose() {
        if (onClose) {
            onClose();
        }
    }
    return (
        <Dialog
            sx={{
                padding: "10px",
                "& .MuiDialog-container > .MuiPaper-root": {
                    borderRadius: "20px",
                    padding: "0px 10px",
                },
            }}
            open={isOpen}
            fullScreen
        >
            <div style={{ width: "100%", display: "flex", justifyContent: "right" }}>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </div>
            {isOpen && (
                <Grid container columns={3}>
                    <Grid xs={1} display={"flex"} flexDirection={"column"}>
                        <CustomerDetails customer={campaign.customer} />
                        <InfluencerDetails
                            events={campaign.campaignTimelineEvents ?? []}
                            influencers={influencers}
                        />
                    </Grid>
                    <Grid xs={1}></Grid>
                    <Grid id="timeline" xs={1}>
                        <TimelineView
                            eventDialogProps={{
                                ...dialogConfig,
                                ...dialogOptions,
                                isOpen: false,
                                influencers,
                            }}
                            events={campaign?.campaignTimelineEvents ?? []}
                            groupBy="week"
                        />
                    </Grid>
                </Grid>
            )}
        </Dialog>
    );
}
export default CampaignDetails;

type CustomerDetailsProps = { customer: Customer };
type CustomerData = (
    | { name: string; value: string; insertAfter?: JSX.Element; insertBefore?: JSX.Element }
    | "spacer"
    | null
)[];
function getCustomerData(customer: Customer): CustomerData {
    return [
        { name: "Firma", value: customer.company },
        "spacer",
        { name: "Kontakt", value: `${customer.firstName} ${customer.lastName}` },
        customer.companyPosition ? { name: "", value: `(${customer.companyPosition})` } : null,
        {
            name: "",
            value: customer.email,
            insertBefore: (
                <a href={`mailto:${customer.email}`} rel="noreferrer" target="_blank">
                    <MailIcon />
                </a>
            ),
        },
    ] satisfies CustomerData;
}
function CustomerDetails(props: CustomerDetailsProps) {
    const { customer } = props;
    const [customerData, setCustomerData] = useState<CustomerData>(getCustomerData(customer));
    useEffect(() => {
        setCustomerData(getCustomerData(customer));

        return () => {};
    }, [customer]);
    return (
        <Accordion defaultExpanded disableGutters elevation={5}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                Auftraggeber
            </AccordionSummary>
            <AccordionDetails>
                {customerData.map((x, i) => {
                    console.log(i, x);
                    if (!x) return null;
                    if (x === "spacer") {
                        return (
                            <div
                                style={{ height: "1em", borderTop: "1px solid black" }}
                                key={`spacer${i}`}
                            />
                        );
                    }
                    return (
                        <Grid key={i + x.name} container columnSpacing={8}>
                            <Grid xs={4} display="flex" justifyContent="left">
                                {x.name}
                            </Grid>
                            <Grid xs="auto" display="flex" justifyContent="left">
                                {x.insertBefore}
                                {x.value}
                                {x.insertAfter}
                            </Grid>
                        </Grid>
                    );
                })}
            </AccordionDetails>
        </Accordion>
    );
}
type InfluencerDetailsProps = {
    events: TimelineEvent.TimelineEvent[];
    influencers: Influencer.InfluencerWithName[];
};

function InfluencerDetails(props: InfluencerDetailsProps) {
    const { influencers, events } = props;
    const [involvedInfluencers, setInvolvedInfluencers] = useState<Influencer.InfluencerWithName[]>(
        [],
    );
    useEffect(() => {
        function getInfluencers() {
            const involvedInfluencers: Influencer.InfluencerWithName[] = [];

            for (const event of events) {
                if (involvedInfluencers.find((x) => x.id === event.influencer.id)) continue;
                const influencer = influencers.find((x) => x.id === event.influencer.id);
                if (!influencer) continue;
                involvedInfluencers.push(influencer);
            }
            return involvedInfluencers;
        }
        setInvolvedInfluencers(getInfluencers());
        return () => {};
    }, [events, influencers]);

    return (
        <Accordion defaultExpanded disableGutters elevation={5}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                Influencer
            </AccordionSummary>
            <AccordionDetails>
                {involvedInfluencers.map((influencer) => {
                    return (
                        <Grid key={influencer.id} container columnSpacing={8}>
                            <Grid xs={"auto"} display="flex" justifyContent="left">
                                {influencer.firstName} {influencer.lastName}
                            </Grid>
                            <Grid xs="auto" display="flex" justifyContent="left"></Grid>
                        </Grid>
                    );
                })}
            </AccordionDetails>
        </Accordion>
    );
}
