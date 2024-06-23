import dayjs from "@/app/utils/configuredDayJs";
import { Campaign, ParentEvent, TimelineEvent } from "../../Functions/Database/types";

interface GroupTaskParams {
    tasks: TimelineEvent[];
    parentEvent: ParentEvent;
    campaign: Campaign;
}

interface GroupTaskReturn {
    finishedTasks: TimelineEvent[];
    pastDueTasks: TimelineEvent[];
    futureTasks: TimelineEvent[];
}

export default function groupTasks({ tasks, parentEvent, campaign }: GroupTaskParams) {
    const now = dayjs();
    const output: GroupTaskReturn = {
        finishedTasks: [],
        pastDueTasks: [],
        futureTasks: [],
    };
    tasks.reduce((acc, task) => {
        if (task.isCompleted) {
            acc.finishedTasks.push(task);
            return acc;
        }
        if (dayjs(task.date).isBefore(now)) {
            acc.pastDueTasks.push(task);
            return acc;
        }
        acc.futureTasks.push(task);
        return acc;
    }, output);
    return output;
}
