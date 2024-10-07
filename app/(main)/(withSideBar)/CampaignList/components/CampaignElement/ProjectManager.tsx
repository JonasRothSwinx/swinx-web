import { queryKeys } from "@/app/(main)/queryClient/keys";
import { dataClient } from "@dataClient";
import { ProjectManagers } from "@/app/ServerFunctions/types";
import { Skeleton, Box, Typography } from "@mui/material";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface ProjectManagerProps {
    campaignId: string;
}
export function ProjectManager({ campaignId }: ProjectManagerProps) {
    const campaign = useQuery({
        queryKey: queryKeys.campaign.one(campaignId),
        queryFn: async () => {
            const campaign = await dataClient.campaign.getRef(campaignId);
            return campaign;
        },
    });
    const managers = useQueries({
        queries: [
            ...(campaign.data?.projectManagerIds.map((id) => ({
                queryKey: queryKeys.projectManager.one(id),
                queryFn: () => dataClient.projectManager.get({ id }),
            })) ?? []),
        ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const isFetchingData = useMemo(() => managers.some((x) => x.isFetching), [...managers]);
    if (managers.some((x) => x.isLoading)) return <Skeleton />;
    return (
        <Box className={[isFetchingData ? "loading" : ""].join(" ")}>
            {managers.map(({ data: manager }) => {
                if (!manager) return null;
                return <Typography key={manager.id}>{ProjectManagers.getFullName(manager)}</Typography>;
            })}
        </Box>
    );
}
