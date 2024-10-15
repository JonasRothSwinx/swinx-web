import { queryKeys } from "@/app/(main)/queryClient/keys";
import { assignment } from "@/app/ServerFunctions/database/dataClients/assignments";
import { Campaigns, Event, Assignment, Influencers } from "@/app/ServerFunctions/types";
import { dataClient } from "@dataClient";
import { Box, Icon, List, ListItem, ListItemIcon, ListItemText, Skeleton, SxProps, Typography } from "@mui/material";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Dayjs, dayjs } from "@/app/utils";
import { ArrowRight } from "@mui/icons-material";

const debugNextSteps = [
    "Baue ein Auto aus Kartons und fahre damit durch die Wohnung",
    "Baue ein Flugzeug aus Papier und fliege damit zum Mond",
    "Baue ein Haus aus Spaghetti",
    "Baue ein Kissenfort",
    "Baue ein Labyrinth aus Büchern",
    "Baue ein Raumschiff aus Legosteinen und fliege damit zu den Sternen",
    "Baue ein Schloss aus Sand in deinem Wohnzimmer",
    "Baue eine Brücke aus Zahnstochern",
    "Baue eine Rakete aus Plastikflaschen",
    "Baue eine Stadt aus Legosteinen",
    "Baue einen Roboter aus Dosen",
    "Erfinde ein neues Brettspiel und spiele es mit deiner Familie",
    "Erfinde ein neues Instrument und spiele ein Konzert",
    "Erfinde eine Geschichte über einen fliegenden Elefanten",
    "Erfinde eine Geschichte über einen sprechenden Kühlschrank",
    "Erfinde eine Geschichte über einen Zauberer, der nur Gemüse zaubern kann",
    "Erfinde eine neue Farbe",
    "Erfinde eine neue Sportart mit Luftballons",
    "Erfinde eine neue Sportart mit Marshmallows",
    "Erfinde eine neue Sprache und unterrichte sie deinen Freunden",
    "Erfinde eine neue Tanzbewegung namens 'Der Wackelpudding'",
    "Erstelle eine Schatzkarte",
    "Finde den geheimen Keks",
    "Füttere einen unsichtbaren Drachen",
    "Lerne die Sprache der Bienen",
    "Male ein Bild mit geschlossenen Augen",
    "Male ein Bild von einem Dinosaurier, der Pizza isst",
    "Male ein Bild von einem Drachen, der Seifenblasen macht",
    "Male ein Bild von einem Einhorn auf einem Skateboard",
    "Male ein Bild von einem Elefanten, der auf Stelzen läuft",
    "Male ein Bild von einem Piraten, der auf einem Regenbogen segelt",
    "Male ein Selbstporträt als Superheld",
    "Organisiere eine Modenschau für deine Socken",
    "Organisiere eine Party für deine Kuscheltiere",
    "Schreibe ein Drehbuch für einen Film über sprechende Pflanzen",
    "Schreibe ein Gedicht über eine verliebte Kartoffel",
    "Schreibe ein Gedicht über einen singenden Baum",
    "Schreibe ein Gedicht über Käse",
    "Schreibe ein Lied über einen singenden Fisch",
    "Schreibe ein Lied über einen tanzenden Roboter",
    "Schreibe eine Geschichte über einen Detektiv-Hamster",
    "Schreibe eine Geschichte über einen Superhelden, der Kuchen backt",
    "Schreibe einen Brief an einen Außerirdischen",
    "Singe ein Lied rückwärts",
    "Tanze als ob niemand zuschaut",
];
interface NextStepsProps {
    campaignId: string;
}
export function NextSteps({ campaignId }: NextStepsProps) {
    // return null;
    const campaign = useQuery({
        queryKey: queryKeys.campaign.one(campaignId),
        queryFn: async () => {
            const campaign = await dataClient.campaign.getRef(campaignId);
            return campaign;
        },
    });
    const events = useQueries({
        queries:
            campaign.data?.events.map(({ id }) => ({
                queryKey: queryKeys.event.one(id),
                queryFn: async () => {
                    const event = await dataClient.event.get(id);
                    return event;
                },
            })) ?? [],
    });
    const assignments = useQueries({
        queries:
            campaign.data?.assignmentIds.map((id) => ({
                queryKey: queryKeys.assignment.one(id),
                queryFn: async () => {
                    const assignment = await dataClient.assignment.get(id);
                    return assignment;
                },
            })) ?? [],
    });

    const assignedInfluencers = assignments.map((x) => x.data?.influencer).filter((x) => !!x);
    const influencers = useQueries({
        queries: assignedInfluencers.map((influencer) => {
            return {
                queryKey: queryKeys.influencer.one(influencer?.id ?? ""),
                queryFn: async () => {
                    const influencerData = await dataClient.influencer.get(influencer?.id ?? "");
                    return influencerData;
                },
            };
        }),
    });
    const nextSteps = useMemo(() => {
        if (
            !campaign.data ||
            !events.every((x) => !!x.data) ||
            !assignments.every((x) => !!x.data) ||
            !influencers.every((x) => !!x.data)
        )
            return [];

        return determineNextSteps({
            campaign: campaign.data,
            events: events.map((x) => x.data),
            assignments: assignments.map((x) => x.data),
            influencers: influencers.map((x) => x.data),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaign.data, ...events, ...assignments]);
    const isFetching = useMemo(() => {
        return [...events, ...assignments].some((x) => x.isFetching);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...events, ...assignments]);
    if ([campaign, ...events, ...assignments].some((x) => x.isLoading)) return <Skeleton id="NextStepsSkeleton" />;
    if ([campaign, ...events, ...assignments].some((x) => x.isError)) {
        const errors = [campaign, ...events, ...assignments].filter((x) => x.isError).map((x) => x.error);
        return (
            <Typography>
                Error loading next steps
                <br />
                {JSON.stringify(errors, null, 2)}
            </Typography>
        );
    }
    const sx: SxProps = {
        maxWidth: "400px",
        ".MuiList-root": {
            padding: "0",
            pl: "2",
            // listStyleType: "disc",
            ".MuiListItem-root": {
                padding: "0 0.5rem 0 0 ",
                // display: "list-item",
                ".MuiListItemIcon-root": {
                    minWidth: "1rem",
                },
                ".MuiListItemText-root": {
                    padding: "0",
                    ".MuiTypography-root": {
                        fontSize: "0.8rem",
                    },
                },
            },
        },
    };
    return (
        <Box className={["categoryContainer", isFetching ? "loading" : ""].join(" ")} sx={sx}>
            <Typography variant="h6" className="categoryTitle">
                Nächste Schritte
            </Typography>
            <List>
                {nextSteps.map((nextStep, index) => (
                    <ListItem key={index}>
                        <ListItemIcon>
                            <ArrowRight />
                        </ListItemIcon>
                        <ListItemText>{nextStep}</ListItemText>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

interface DetermineNextStepsProps {
    campaign: Campaigns.Referential;
    events: Event[];
    assignments: Assignment[];
    influencers: Influencers.Influencer[];
}
function determineNextSteps({ campaign, events, assignments, influencers }: DetermineNextStepsProps): string[] {
    const nextSteps: string[] = [];
    const webinars = events.filter((event) => event.type === "Webinar");
    if (webinars.length === 0) {
        nextSteps.push("Erstelle ein Webinar");
        return nextSteps;
    }
    webinars.forEach((webinar) => {
        if (!webinar.date) {
            nextSteps.push(`Setze ein Datum für das Webinar "${webinar.eventTitle}"`);
            return;
        }
        if (!webinar.info?.eventLink && assignments.length > 0) {
            nextSteps.push(`Füge einen Link zum Webinar "${webinar.eventTitle}" hinzu`);
        }
    });

    if (assignments.length === 0) {
        nextSteps.push(`Definiere Aufgaben für die Kampagne`);
        return nextSteps;
    }
    const assignmentCategories: {
        placeholder: Assignment[];
        assigned: Assignment[];
    } = { placeholder: [], assigned: [] };
    assignments.reduce((acc, assignment) => {
        if (assignment.influencer) acc.assigned.push(assignment);
        else acc.placeholder.push(assignment);
        return acc;
    }, assignmentCategories);

    assignmentCategories.placeholder.forEach((assignment) => {
        if (assignment.timelineEvents.length === 0) {
            nextSteps.push(`Weise Aufgaben für Influencer ${assignment.placeholderName} zu`);
        } else if (!assignment.influencer && (!assignment.candidates || assignment.candidates?.length === 0)) {
            nextSteps.push(`Finde einen Influencer für ${assignment.placeholderName}`);
        } else if (!assignment.influencer) {
            nextSteps.push(`  Bestätigung von Influencer für ${assignment.placeholderName}`);
        }
    });

    assignmentCategories.assigned.forEach((assignment) => {
        const nextEvent = assignment.timelineEvents
            .filter((x) => !!x.date && x.status !== "COMPLETED")
            .sort((a, b) => {
                const relevantDates = [a, b].map((event) => {
                    if (
                        event.info &&
                        event.info.draftDeadline &&
                        ["WAITING_FOR_DRAFT", "WAITING_FOR_APPROVAL", "REJECTED"].includes(event.status)
                    ) {
                        return dayjs(event.info?.draftDeadline);
                    } else return dayjs(event.date);
                });
                return relevantDates[0].diff(relevantDates[1]);
            })[0];
        if (nextEvent) {
            if (!assignment.influencer) return;
            const influencerName = Influencers.getFullName(assignment.influencer);
            switch (nextEvent.type) {
                case "Post": {
                    switch (nextEvent.status) {
                        case "WAITING_FOR_DRAFT": {
                            nextSteps.push(
                                `Beitragsentwurf von ${influencerName} bis ${dateFormat(
                                    dayjs(nextEvent.info?.draftDeadline)
                                )}`
                            );
                            break;
                        }
                        case "WAITING_FOR_APPROVAL": {
                            nextSteps.push(`Beitragsentwurf von  ${influencerName} wartet auf Freigabe!`);
                            break;
                        }
                        case "APPROVED": {
                            nextSteps.push(
                                `Beitragsveröffentlichung von ${influencerName} am ${dateFormat(nextEvent.date)}`
                            );
                            break;
                        }
                        case "REJECTED": {
                            nextSteps.push(
                                `Angepasster Entwurf von ${influencerName} bis ${dateFormat(
                                    dayjs(nextEvent.info?.draftDeadline)
                                )}`
                            );
                            break;
                        }
                        default: {
                            nextSteps.push(randomStep());
                        }
                    }
                    break;
                }
                case "Video": {
                    switch (nextEvent.status) {
                        case "WAITING_FOR_DRAFT": {
                            nextSteps.push(
                                `Videoaufnahme von ${influencerName} bis ${dateFormat(
                                    dayjs(nextEvent.info?.draftDeadline)
                                )}`
                            );
                            break;
                        }
                        case "WAITING_FOR_APPROVAL": {
                            nextSteps.push(`Video von ${influencerName} wartet auf Freigabe!`);
                            break;
                        }
                        case "APPROVED": {
                            nextSteps.push(
                                `Beitragsveröffentlichung von ${influencerName} am ${dateFormat(nextEvent.date)}`
                            );
                            break;
                        }
                        case "REJECTED": {
                            nextSteps.push(
                                `Angepasstes Video von ${influencerName} bis ${dateFormat(
                                    dayjs(nextEvent.info?.draftDeadline)
                                )}`
                            );
                            break;
                        }
                        default: {
                            nextSteps.push(randomStep());
                        }
                    }
                    break;
                }
                case "Invites": {
                    switch (nextEvent.status) {
                        case "WAITING_FOR_DRAFT": {
                            nextSteps.push(`Einladungsversand von ${influencerName} am ${dateFormat(nextEvent.date)}`);
                            break;
                        }
                        case "WAITING_FOR_APPROVAL": {
                            nextSteps.push(`${influencerName} hat Screenshot von Einladungen eingeschickt`);
                            break;
                        }
                        default: {
                            nextSteps.push(randomStep());
                        }
                    }
                    break;
                }
                case "ImpulsVideo": {
                    switch (nextEvent.status) {
                        case "WAITING_FOR_DRAFT": {
                            nextSteps.push(
                                `Impuls-Videoaufnahme von ${influencerName} bis ${dateFormat(
                                    dayjs(nextEvent.info?.draftDeadline)
                                )}`
                            );
                            break;
                        }
                        case "WAITING_FOR_APPROVAL": {
                            nextSteps.push(`Impuls-Video von ${influencerName} wartet auf Freigabe!`);
                            break;
                        }
                        case "APPROVED": {
                            nextSteps.push(
                                `Impuls-Beitragsveröffentlichung von ${influencerName} am ${dateFormat(nextEvent.date)}`
                            );
                            break;
                        }
                        case "REJECTED": {
                            nextSteps.push(
                                `Angepasstes Impuls-Video von ${influencerName} bis ${dateFormat(
                                    dayjs(nextEvent.info?.draftDeadline)
                                )}`
                            );
                            break;
                        }
                        default: {
                            nextSteps.push(randomStep());
                        }
                    }
                    break;
                }
                case "WebinarSpeaker": {
                    switch (nextEvent.status) {
                        case "WAITING_FOR_DRAFT": {
                            nextSteps.push(
                                `Webinar-Vortrag von ${influencerName} bis ${dateFormat(
                                    dayjs(nextEvent.info?.draftDeadline)
                                )}`
                            );
                            break;
                        }
                        case "WAITING_FOR_APPROVAL": {
                            nextSteps.push(`Webinar-Vortrag von ${influencerName} wartet auf Freigabe!`);
                            break;
                        }
                        case "APPROVED": {
                            nextSteps.push(`Webinar-Vortrag von ${influencerName} am ${dateFormat(nextEvent.date)}`);
                            break;
                        }
                        case "REJECTED": {
                            nextSteps.push(
                                `Angepasster Webinar-Vortrag von ${influencerName} bis ${dateFormat(
                                    dayjs(nextEvent.info?.draftDeadline)
                                )}`
                            );
                            break;
                        }
                        default: {
                            nextSteps.push(randomStep());
                        }
                    }
                    break;
                }
                case "Webinar": {
                    break;
                }
                default: {
                    nextSteps.push(randomStep());
                }
            }
        }
    });

    if (nextSteps.length > 0) return nextSteps;

    return [debugNextSteps[Math.floor(Math.random() * debugNextSteps.length)]];
}

function randomStep() {
    return debugNextSteps[Math.floor(Math.random() * debugNextSteps.length)];
}
function dateFormat(date: Dayjs | string | undefined): string {
    if (!date) return "Datum nicht gesetzt";
    if (typeof date === "string") date = dayjs(date);
    if (date.isSame(dayjs(), "year")) return date.format("DD.MM");
    return date.format("DD.MM.YYYY");
}
