import { QueryClient } from "@tanstack/react-query";

// export const config = { setQueryClient, getQueryClient };

// type dataClientConfig = {
//     queryClient: QueryClient | null;
// };

// const dataClientConfig: dataClientConfig = {
//     queryClient: null,
// };

// function setQueryClient(queryClient: QueryClient) {
//     console.info("Setting query client");
//     dataClientConfig.queryClient = queryClient;
// }

// /**
//  * Get the query client
//  * @returns The query client
//  * @throws Error if the query client is not set
//  */
// function getQueryClient() {
//     if (!dataClientConfig.queryClient) {
//         throw new Error("Query client not set");
//     }
//     return dataClientConfig.queryClient;
// }

export class QueryClientConfig {
    private static queryClient: QueryClient | null = null;
    private static instance: QueryClientConfig;
    constructor(queryClient: QueryClient) {
        if (!QueryClientConfig.instance) {
            QueryClientConfig.instance = this;
        }
        QueryClientConfig.queryClient = queryClient;
        return QueryClientConfig.instance;
    }
    public static init(queryClient: QueryClient) {
        if (!QueryClientConfig.instance) {
            QueryClientConfig.instance = new QueryClientConfig(queryClient);
        }
    }

    public static setQueryClient(queryClient: QueryClient) {
        console.info("Setting query client");
        QueryClientConfig.queryClient = queryClient;
    }

    public static getQueryClient() {
        if (!QueryClientConfig.queryClient) {
            console.log(QueryClientConfig.queryClient);
            throw new Error("Query client not set");
        }
        return QueryClientConfig.queryClient;
    }
}
