import { Campaign, Customer, Influencer, TimelineEvent } from "@/app/ServerFunctions/databaseTypes";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    Unstable_Grid2 as Grid,
    IconButton,
    Skeleton,
    TextField,
    Typography,
} from "@mui/material";
import TimelineView, { groupBy } from "../Timeline/TimeLineView";
import {
    Refresh as RefreshIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    CloseFullscreen as CloseFullscreenIcon,
    Close as CloseIcon,
    ExpandMore as ExpandMoreIcon,
    Mail as MailIcon,
} from "@mui/icons-material";
import { TimelineEventDialogProps } from "../Dialogs/TimelineEventDialog";
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { DialogConfig, DialogOptions } from "@/app/Definitions/types";
import dayjs, { Dayjs } from "@/app/configuredDayJs";
import { deleteCampaign, getCampaign, listInfluencers } from "@/app/ServerFunctions/serverActions";
import stylesExporter from "../styles/stylesExporter";
import CustomerDialog from "../Dialogs/CustomerDialog";

const styles = stylesExporter.campaignDetails;

interface CampaignDetailsProps {
    isOpen: boolean;
    campaignId: string;
    onClose: (hasChanged?: boolean) => void;
}

function CampaignDetails(props: CampaignDetailsProps) {
    const { isOpen, onClose, campaignId } = props;
    const [campaign, setCampaign] = useState<Campaign.Campaign>();
    const [influencers, setInfluencers] = useState<Influencer.InfluencerFull[]>([]);
    const [highlightedEvent, setHighlightedEvent] = useState<TimelineEvent.TimelineEvent>();
    const [loading, setLoading] = useState(false);

    function onDialogClose() {
        updateCampaign();
    }
    function handleClose(hasChanged?: boolean) {
        if (onClose) {
            onClose(true || hasChanged);
        }
    }
    // useEffect(() => {
    //     console.log("applying props", props);
    //     setInfluencers(props.influencers);

    //     return () => {};
    // }, [props]);

    useEffect(() => {
        console.log("campaign changed");

        return () => {};
    }, [campaign]);

    useEffect(() => {
        updateCampaign();
        updateInfluencers();

        return () => {};
    }, [campaignId]);

    function updateCampaign() {
        if (campaignId === "") return;
        console.log("updating campaign");
        setLoading(true);
        getCampaign(campaignId).then((result) => {
            console.log("newCampaign", result);
            setCampaign(result);
            setLoading(false);
        });
    }
    function updateInfluencers() {
        console.log("updating Influencers");
        listInfluencers().then((result) => setInfluencers(result));
    }
    // console.log(callbackSetCampaign);
    function callbackSetCampaign(campaign: Campaign.Campaign) {
        console.log("callback set triggered");
        setCampaign(campaign);
    }

    return (
        <>
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
                {loading ? (
                    <Skeleton></Skeleton>
                ) : (
                    <>
                        <CampaignDetailsButtons
                            updateCampaign={updateCampaign}
                            handleClose={handleClose}
                            campaign={campaign}
                        />
                        {isOpen && campaign && (
                            <Grid container columns={3}>
                                <Grid xs={1} display={"flex"} flexDirection={"column"}>
                                    <CustomerDetails
                                        campaign={campaign}
                                        customer={campaign?.customer}
                                        setCampaign={callbackSetCampaign}
                                    />
                                    <InfluencerDetails
                                        events={campaign?.campaignTimelineEvents ?? []}
                                        influencers={influencers}
                                        setHighlightedEvent={setHighlightedEvent}
                                    />
                                </Grid>
                                <Grid xs={1}>
                                    <Typography fontSize={8} whiteSpace={"pre-wrap"}>
                                        {JSON.stringify(campaign)?.replaceAll(",", "\n")}
                                    </Typography>
                                </Grid>
                                <Grid id="timeline" xs={1}>
                                    <TimelineView
                                        setCampaign={callbackSetCampaign}
                                        influencers={influencers}
                                        campaign={campaign}
                                        orientation="vertical"
                                        controlsPosition="before"
                                        editable
                                        highlightedEvent={highlightedEvent}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </>
                )}
            </Dialog>
        </>
    );
}
export default CampaignDetails;

interface CampaignDetailsButtonsProps {
    updateCampaign: () => void;
    handleClose: (hasChanged?: boolean) => void;
    campaign?: Campaign.Campaign;
}
function CampaignDetailsButtons(props: CampaignDetailsButtonsProps) {
    const { updateCampaign, handleClose, campaign } = props;
    const ClickHandlers = {
        deleteCampaign: () => {
            return () => {
                if (!campaign || !confirm("Kampagne wirklich unwiderruflich löschen?")) return;
                deleteCampaign(campaign);
                handleClose(true);
            };
        },
    };
    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "right", position: "relative" }}>
            {campaign ? (
                <Button
                    style={{ position: "absolute", left: "0" }}
                    variant="outlined"
                    color="inherit"
                    onClick={ClickHandlers.deleteCampaign()}
                >
                    <DeleteIcon color="error" />
                    <Typography color="error" variant="body1">
                        Löschen
                    </Typography>
                </Button>
            ) : (
                <Skeleton />
            )}
            <IconButton onClick={() => updateCampaign()}>
                <RefreshIcon />
            </IconButton>
            <IconButton onClick={() => handleClose()}>
                <CloseIcon />
            </IconButton>
        </div>
    );
}

type CustomerDetailsProps = {
    customer: Customer;
    campaign: Campaign.Campaign;
    setCampaign: (data: Campaign.Campaign) => void;
};
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
    const { customer, campaign, setCampaign } = props;
    const [customerData, setCustomerData] = useState<CustomerData>(getCustomerData(customer));
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        setCustomerData(getCustomerData(customer));

        return () => {};
    }, [customer]);

    const config: DialogConfig<Campaign.Campaign> = {
        parent: campaign,
        setParent: setCampaign,
        onClose: () => setIsDialogOpen(false),
    };
    const options: DialogOptions = {
        editing: true,
    };

    function handleEditButton(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsDialogOpen(true);
    }
    return (
        <>
            <>
                <CustomerDialog {...config} {...options} isOpen={isDialogOpen} editingData={customer} />
            </>
            <Accordion defaultExpanded disableGutters elevation={5}>
                <AccordionSummary
                    className={styles.summaryWithEdit}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{ "& .MuiAccordionSummary-content:not(.Mui-expanded) button": { display: "none" } }}
                >
                    <div className={styles.summaryWithEdit}>
                        Auftraggeber
                        <IconButton className="textPrimary" onClick={handleEditButton} color="inherit">
                            <EditIcon />
                        </IconButton>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    {customerData.map((x, i) => {
                        if (!x) return null;
                        if (x === "spacer") {
                            return <div style={{ height: "1em", borderTop: "1px solid black" }} key={`spacer${i}`} />;
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
        </>
    );
}
type InfluencerDetailsProps = {
    events: TimelineEvent.TimelineEvent[];
    influencers: Influencer.InfluencerFull[];
    setHighlightedEvent: Dispatch<SetStateAction<TimelineEvent.TimelineEvent | undefined>>;
};

function InfluencerDetails(props: InfluencerDetailsProps) {
    const { influencers, events, setHighlightedEvent } = props;
    const [involvedInfluencers, setInvolvedInfluencers] = useState<Influencer.AssignedInfluencer[]>([]);
    useEffect(() => {
        function getInfluencers() {
            const involvedInfluencers: Influencer.AssignedInfluencer[] = [];

            for (const event of events) {
                const influencer = influencers.find((x) => x.id === event.influencer.id);
                if (!influencer) continue;
                const involvedInfluencer = involvedInfluencers.find((x) => x.id === influencer.id);
                switch (true) {
                    case TimelineEvent.isInviteEvent(event): {
                        if (!event.inviteEvent) continue;
                        if (involvedInfluencer) {
                            involvedInfluencer.inviteEvents.push(event);
                        } else {
                            involvedInfluencers.push({ ...influencer, inviteEvents: [event] });
                        }
                        break;
                    }
                    default:
                        break;
                }
            }
            for (const influencer of involvedInfluencers) {
                influencer.inviteEvents.sort((a, b) => (a.date && b.date ? a.date.localeCompare(b.date) : 0));
            }
            return involvedInfluencers;
        }
        setInvolvedInfluencers(getInfluencers());
        return () => {};
    }, [events, influencers]);
    return (
        <Accordion defaultExpanded disableGutters elevation={5}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                Influencer
            </AccordionSummary>
            <AccordionDetails>
                {involvedInfluencers.map((influencer) => {
                    // console.log(influencer);
                    return (
                        <Accordion key={influencer.id} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                {influencer.firstName} {influencer.lastName}
                            </AccordionSummary>
                            <AccordionDetails>
                                {influencer.inviteEvents.length > 0 && (
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            Invites:{" "}
                                            {influencer.inviteEvents.reduce((sum: number, event) => {
                                                return sum + (event?.inviteEvent?.invites ?? 0);
                                            }, 0)}{" "}
                                            verteilt über {influencer.inviteEvents.length} Termine
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Grid container>
                                                {influencer.inviteEvents.map((event) => {
                                                    const date = dayjs(event.date);
                                                    return (
                                                        <Grid
                                                            xs={12}
                                                            key={event.id}
                                                            onClick={() => {
                                                                setHighlightedEvent(event);
                                                            }}
                                                        >
                                                            <Typography>
                                                                {date.format("DD.MM.YYYY")} ({date.fromNow()})
                                                            </Typography>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </AccordionDetails>
        </Accordion>
    );
}
