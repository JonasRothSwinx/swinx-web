export type SESError = SESErrorCommon;

type SESErrorCommon = {
    name?: string;
    message?: string;
    $fault?: string;
    $metadata?: {
        httpStatusCode?: number;
        requestId?: string;
        attempts?: number;
        cfID?: string;
        extendedRequestId?: string;
        totalRetryDelay?: number;
    };
};
