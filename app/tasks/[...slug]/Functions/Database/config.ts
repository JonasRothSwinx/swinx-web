// import { QueryClient } from "@tanstack/react-query";

// export const config = { setQueryClient, getQueryClient };

// type dataClientConfig = {
//     queryClient: QueryClient | null;
// };

// const datClientConfig: dataClientConfig = {
//     queryClient: null,
// };

// function setQueryClient(queryClient: QueryClient) {
//     // console.log("Setting query client",queryClient);
//     datClientConfig.queryClient = queryClient;
// }

// /**
//  * Get the query client
//  * @returns The query client
//  * @throws Error if the query client is not set
//  */
// function getQueryClient() {
//     if (!datClientConfig.queryClient) {
//         throw new Error("Query client not set");
//     }
//     return datClientConfig.queryClient;
// }

export * from "@/app/ServerFunctions/database/dataClients/config";
