import { QueryClient } from "@tanstack/react-query";
import { DataType } from "../../StorageManagerDialog";
import { remove } from "aws-amplify/storage";

interface OnUploadSuccess {
    file: { key?: string };
    currentFiles: { data?: { path: string }[] };
    queryClient: QueryClient;
    campaignId: string;
    eventId: string;
    dataType: DataType;
}
export async function onUploadSuccess({
    file,
    queryClient,
    currentFiles,
    campaignId,
    eventId,
    dataType,
}: OnUploadSuccess) {
    try {
        if (!currentFiles.data) return;

        Promise.all(
            currentFiles.data.map(async (prevFile) => {
                if (prevFile.path === file.key) return Promise.resolve();
                await remove({ path: prevFile.path });
            }),
        )
            .then(async () => {
                await queryClient.invalidateQueries({
                    queryKey: [eventId, dataType],
                });
            })
            .catch((error) => {
                if (!(error instanceof Error)) return;
                console.error("onUploadSuccessError", { currentFiles, error });
            });
        await queryClient.setQueryData(
            [eventId, dataType],
            [{ path: file.key, lastModified: new Date() }],
        );
        await queryClient.invalidateQueries({
            queryKey: [file.key],
        });
    } catch (error) {
        console.error("onUploadSuccessError", error);
    }
}
