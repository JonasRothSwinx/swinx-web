import { TimelineEvent } from "@/app/ServerFunctions/serverActions";
import { randomDate, randomId } from "@mui/x-data-grid-generator";

export interface TimelineViewProps {
    events: TimelineEvent[];
}

function makeDebugData() {
    const event: TimelineEvent[] = [];
    const now = new Date();
    for (let index = 0; index < 10; index++) {
        const date = randomDate(now, new Date(now.getDate() + 31));
        const debugEvent = {
            id: randomId(),
            createdAt: date.toISOString(),
            updatedAt: date.toISOString(),
        };
    }
}
const defaultEvents: TimelineEvent[] = [];
function TimelineView(props: TimelineViewProps) {
    const {} = props;

    return <></>;
}

export default TimelineView;
