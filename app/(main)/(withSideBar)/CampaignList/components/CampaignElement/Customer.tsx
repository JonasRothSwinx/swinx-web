import { queryKeys } from "@/app/(main)/queryClient/keys";
import { campaign } from "@/app/ServerFunctions/database/dbOperations/campaigns";
import { dataClient } from "@dataClient";
import { Skeleton, Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface CustomerProps {
    campaignId: string;
}
export function Customer({ campaignId }: CustomerProps) {
    const campaign = useQuery({
        queryKey: queryKeys.campaign.one(campaignId),
        queryFn: async () => {
            const campaign = await dataClient.campaign.getRef(campaignId);
            return campaign;
        },
    });
    const customer = useQuery({
        enabled: !!campaign.data?.customerIds,
        queryKey: queryKeys.customer.one(campaign.data?.customerIds[0] ?? ""),
        queryFn: async ({ queryKey: [_, customerId] }) => {
            if (!customerId) return null;

            const customer = await dataClient.customer.get({ id: customerId });
            return customer;
        },
    });

    if (customer.isLoading) {
        return (
            <>
                <Skeleton />
                <Skeleton />
            </>
        );
    }
    if (!customer.data) return null;
    return (
        <Box className={["categoryContainer", customer.isFetching ? "loading" : ""].join(" ")}>
            <Typography
                variant="h6"
                className="categoryTitle"
            >
                Kunde:
            </Typography>
            <Typography>{customer.data.company}</Typography>
            {/* <Typography>{Customers.getFullName(customer.data)}</Typography> */}
        </Box>
    );
}
