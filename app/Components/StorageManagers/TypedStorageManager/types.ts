export interface StorageManagerProps {
    campaignId: string;
    eventId: string;
    onSuccess?: ({ campaignId, eventId }: { campaignId: string; eventId: string }) => Promise<void>;
}
