import { Prettify } from "@/app/Definitions/types";
import Assignment from "./assignment";
export namespace StaticEvent {
    export type StaticEvent = Prettify<StaticEventStub>;
    export const eventValues = ["Webinar"] as const;
    export type eventType = (typeof eventValues)[number];

    type StaticEventStub = {
        id?: string;
        type: eventType;
        assignments: Assignment.AssignmentMin[];
        // influencerAssignmentId: string;
        createdAt?: string;
        updatedAt?: string;
        date?: string;
        notes?: string | null;
        campaign: { id: string };

        eventAssignmentAmount: number;
        eventTitle: string;
    };
    export function isWebinarEvent(event: StaticEvent): event is Webinar {
        return event.type === "Webinar";
    }
    export type Webinar = {
        type: "Webinar";
        eventAssignmentAmount: number;
        eventTitle: string;
    } & StaticEventStub;
}
