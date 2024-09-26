import { LoadingElement } from "@/app/Components";
import { dataClient } from "@/app/ServerFunctions/database";
import { campaign } from "@/app/ServerFunctions/database/dataClients";
import { Campaign, Campaigns, Customers, ProjectManagers } from "@/app/ServerFunctions/types";
import { Box, Skeleton, SxProps, Typography } from "@mui/material";
import { useQueries, useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface CampaignElement {
    campaignId: string;
    show?: {
        manager?: boolean;
        customer?: boolean;
        webinar?: boolean;
        id?: boolean;
    };
}
export function CampaignElement({
    campaignId,
    show: {
        manager: showManager = true,
        customer: showCustomer = true,
        id: showId = true,
        webinar: showWebinar = true,
    } = {},
}: CampaignElement) {
    const campaign = useQuery({
        queryKey: ["campaigns", campaignId],
        queryFn: async () => {
            const campaign = await dataClient.campaign.get(campaignId);
            return campaign;
        },
    });
    const sx: SxProps = {
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        justifyContent: "center",
        maxWidth: "max-content",
        padding: "10px",
        borderRadius: "10px",
        border: "1px solid #e0e0e0",
        // width: "100px",
        // maxWidth: "300px",
        minWidth: "200px",
        backgroundColor: "white",
        ".MuiSkeleton-root": {
            width: "100%",
            minWidth: "300px",
        },
        ".categoryContainer": {
            display: "flex",
            flexDirection: "column",
            // gap: "5px",
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #e0e0e0",
        },
    };
    if (campaign.isLoading)
        return (
            <Box sx={sx}>
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </Box>
        );
    if (!campaign.data) return null;
    return (
        <Link
            href={`/campaign/${campaignId}`}
            passHref
        >
            <Box sx={sx}>
                {showId && <Typography>id: {campaignId}</Typography>}
                {showManager && (
                    <ProjectManager managerIds={campaign.data.projectManagers.map((x) => x.id)} />
                )}
                {showCustomer && <Customer customerId={campaign.data.customers[0].id} />}
                {showWebinar && <Webinar campaignId={campaignId} />}
            </Box>
        </Link>
    );
}

interface ProjectManagerProps {
    managerIds: string[];
}
function ProjectManager({ managerIds }: ProjectManagerProps) {
    const managers = useQueries({
        queries: [
            ...managerIds.map((id) => ({
                queryKey: ["projectManager", id],
                queryFn: async () => {
                    const manager = await dataClient.projectManager.get({ id });
                    return manager;
                },
            })),
        ],
    });
    if (managers.some((x) => x.isLoading)) return <Skeleton />;
    return (
        <Box>
            {managers.map(({ data: manager }) => {
                if (!manager) return null;
                return (
                    <Typography key={manager.id}>{ProjectManagers.getFullName(manager)}</Typography>
                );
            })}
        </Box>
    );
}

interface CustomerProps {
    customerId?: string;
}
function Customer({ customerId }: CustomerProps) {
    const customer = useQuery({
        queryKey: ["customer", customerId],
        queryFn: async () => {
            if (!customerId) return null;

            const customer = await dataClient.customer.get({ id: customerId });
            return customer;
        },
    });
    if (!customerId) return null;
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
        <Box className="categoryContainer">
            <Typography className="categoryTitle">Kunde:</Typography>
            <Typography>{customer.data.company}</Typography>
            {/* <Typography>{Customers.getFullName(customer.data)}</Typography> */}
        </Box>
    );
}

interface WebinarProps {
    campaignId: string;
}
function Webinar({ campaignId }: WebinarProps) {
    return (
        <Box className="categoryContainer">
            <Typography>Webinar in xyz Tagen</Typography>
        </Box>
    );
}
