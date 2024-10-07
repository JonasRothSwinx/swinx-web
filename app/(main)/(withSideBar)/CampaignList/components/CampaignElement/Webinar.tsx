import { queryKeys } from "@/app/(main)/queryClient/keys";
import { LoadingElement } from "@/app/Components/Loading";
import { dataClient } from "@dataClient";
import { Box, Skeleton, Typography } from "@mui/material";
import { useQuery, useQueries } from "@tanstack/react-query";
import { Dayjs, dayjs } from "@/app/utils";
import { Event } from "@/app/ServerFunctions/types";
import { useMemo } from "react";

interface WebinarProps {
    campaignId: string;
}
export function Webinar({ campaignId }: WebinarProps) {
    const campaign = useQuery({
        queryKey: queryKeys.campaign.one(campaignId),
        queryFn: async () => {
            const campaign = await dataClient.campaign.getRef(campaignId);
            return campaign;
        },
    });
    const webinarIds = campaign.data?.events
        ?.filter((event) => event.type === "Webinar")
        .map((event) => event.id);

    const webinars = useQueries({
        queries:
            webinarIds?.map((webinarId) => ({
                queryKey: queryKeys.event.one(webinarId),
                queryFn: async () => {
                    const webinar = await dataClient.event.get(webinarId);
                    return webinar;
                },
            })) ?? [],
    });
    const isFetching = useMemo(() => webinars.some((x) => x.isFetching), [webinars]);
    if (webinars.some((x) => x.isLoading)) return <Skeleton id="WebinarSkeleton" />;
    if (webinars.some((x) => x.isError)) return <Typography>Error loading webinars</Typography>;
    if (webinars.length === 0) return null;
    return (
        <Box className={["categoryContainer", isFetching ? "loading" : ""].join(" ")}>
            {webinars.length === 0 ? (
                <Typography>Keine Webinare</Typography>
            ) : (
                <>
                    <Typography
                        variant="h6"
                        className="categoryTitle"
                    >
                        Webinare
                    </Typography>
                    {webinars.map(({ data: webinar }) => {
                        if (!webinar) return null;
                        const date = dayjs(webinar.date).format("DD.MM.YYYY");
                        return (
                            <Box
                                key={webinar.id}
                                className="categoryElement"
                            >
                                <Typography>
                                    {`${dateFormat(webinar.date)} - "${webinar.eventTitle}"`}
                                </Typography>
                            </Box>
                        );
                    })}
                </>
            )}
        </Box>
    );
}

function dateFormat(date: Dayjs | string | undefined): string {
    if (!date) return "Datum nicht gesetzt";
    if (typeof date === "string") date = dayjs(date);
    if (date.isSame(dayjs(), "year")) return date.format("DD.MM.");
    return date.format("DD.MM.YYYY");
}
