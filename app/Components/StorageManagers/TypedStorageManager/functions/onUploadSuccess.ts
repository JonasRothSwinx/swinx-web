import { QueryClient } from "@tanstack/react-query";
import { DataType } from "../../StorageManagerWrapper";
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
            currentFiles.data.map((prevFile) => {
                if (prevFile.path === file.key) return Promise.resolve();
                remove({ path: prevFile.path });
            })
        )
            .then(() => {
                queryClient.invalidateQueries({
                    queryKey: [eventId, dataType],
                });
            })
            .catch((error) => {
                console.error("onUploadSuccessError", { currentFiles, error });
            });
        queryClient.setQueryData([eventId, dataType], [{ path: file.key, lastModified: new Date() }]);
        queryClient.invalidateQueries({
            queryKey: [file.key],
        });
    } catch (error) {
        console.error("onUploadSuccessError", error);
    }
}
