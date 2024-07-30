import { dayjs } from "@/app/utils";
import { Campaign, ParentEvent, TimelineEvent } from "../../Functions/Database/types";

interface GroupTaskParams {
    tasks: TimelineEvent[];
    parentEvent: ParentEvent;
    campaign: Campaign;
}

interface GroupTaskReturn {
    pastDueTasks: TimelineEvent[];
    awatingApprovalTasks: TimelineEvent[];
    futureTasks: TimelineEvent[];
    finishedTasks: TimelineEvent[];
    ungroupedTasks: TimelineEvent[];
}

export default function groupTasks({ tasks, parentEvent, campaign }: GroupTaskParams) {
    const now = dayjs();
    const output: GroupTaskReturn = {
        pastDueTasks: [],
        awatingApprovalTasks: [],
        futureTasks: [],
        finishedTasks: [],
        ungroupedTasks: [],
    };
    tasks.reduce((acc, task) => {
        const { status, date } = task;
        switch (status) {
            case "WAITING_FOR_APPROVAL": {
                acc.awatingApprovalTasks.push(task);
                break;
            }
            case "COMPLETED": {
                acc.finishedTasks.push(task);
                break;
            }
            case null:
            case undefined:
            case "APPROVED":
            case "WAITING_FOR_DRAFT": {
                if (dayjs(date).isBefore(now)) {
                    acc.pastDueTasks.push(task);
                } else {
                    acc.futureTasks.push(task);
                }
                break;
            }
            default: {
                console.log("unhandled task", task);
                acc.ungroupedTasks.push(task);
                break;
            }
        }
        return acc;
    }, output);
    return output;
}
