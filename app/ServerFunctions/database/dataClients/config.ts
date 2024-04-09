import { QueryClient } from "@tanstack/react-query";

type dataClientConfig = {
    queryClient: QueryClient | null;
};

const config: dataClientConfig = {
    queryClient: null,
};

function setQueryClient(queryClient: QueryClient) {
    config.queryClient = queryClient;
}

/**
 * Get the query client
 * @returns The query client
 * @throws Error if the query client is not set
 */
function getQueryClient() {
    if (!config.queryClient) {
        throw new Error("Query client not set");
    }
    return config.queryClient;
}

export default { setQueryClient, getQueryClient };
