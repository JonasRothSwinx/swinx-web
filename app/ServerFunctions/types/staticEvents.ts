import { Prettify } from "@/app/Definitions/types";
import Assignment from "./assignment";
namespace StaticEvent {
    export type StaticEvent = Prettify<StaticEventStub>;
    export const eventValues = ["Webinar"] as const;
    export type eventType = (typeof eventValues)[number];

    export function isStaticEvent(event: unknown): event is StaticEvent {
        const testEvent = event as StaticEvent;
        return (
            typeof testEvent === "object" &&
            testEvent !== null &&
            typeof testEvent.type === "string" &&
            eventValues.includes(testEvent.type)
        );
    }

    export function isStaticEventType(type: string): type is eventType {
        return eventValues.includes(type as eventType);
    }
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
export default StaticEvent;
