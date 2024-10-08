import { queryKeys } from "@/app/(main)/queryClient/keys";
import { dataClient } from "@dataClient";
import { Influencers } from "@/app/ServerFunctions/types";
import { Box, Skeleton, Typography } from "@mui/material";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface InfluencersProps {
    campaignId: string;
}
export function InfluencersInfo({ campaignId }: InfluencersProps) {
    const campaign = useQuery({
        queryKey: queryKeys.campaign.one(campaignId),
        queryFn: async () => {
            const campaign = await dataClient.campaign.getRef(campaignId);
            return campaign;
        },
    });
    const assignments = useQuery({
        queryKey: queryKeys.assignment.byCampaign(campaignId),
        queryFn: async () => {
            const assignments = await dataClient.assignment.byCampaign(campaignId);
            return assignments;
        },
    });
    const influencerIds =
        assignments.data?.map((assignment) => assignment.influencer?.id).filter((x) => x !== undefined) ?? [];

    const influencers = useQueries({
        queries: influencerIds.map((influencerId) => {
            return {
                queryKey: queryKeys.influencer.one(influencerId),
                queryFn: async () => {
                    const influencer = await dataClient.influencer.get(influencerId);
                    return influencer;
                },
            };
        }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const isFetchingData = useMemo(() => influencers.some((x) => x.isFetching), [...influencers]);
    if (campaign.isLoading || influencers.some((x) => x.isLoading)) return <Skeleton />;
    if (influencers.length === 0) return null;
    return (
        <Box className={["categoryContainer", isFetchingData ? "loading" : ""].join(" ")}>
            {influencers.length === 0 ? (
                <Typography>Keine Influencer</Typography>
            ) : (
                <>
                    <Typography variant="h6" className="categoryTitle">
                        Influencer
                    </Typography>
                    {influencers.map(({ data: influencer }) => {
                        if (influencer === undefined) return null;
                        return (
                            <Box key={influencer.id} className="categoryElement">
                                {Influencers.getFullName(influencer)}
                            </Box>
                        );
                    })}
                </>
            )}
        </Box>
    );
}
