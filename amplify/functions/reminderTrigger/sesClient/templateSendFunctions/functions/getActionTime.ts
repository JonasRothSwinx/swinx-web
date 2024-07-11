import { dayjs } from "@/app/utils";
interface GetActionTime {
    actionDate?: string | null;
    dateOnly?: boolean;
}

export function getActionTime({ actionDate, dateOnly = false }: GetActionTime): string {
    const now = dayjs();
    const actionTime = dayjs(actionDate);
    if (!actionTime.isValid()) {
        return "am Ende aller Tage";
    }
    if (now.isSame(actionTime, "day")) {
        if (dateOnly) {
            return `heute`;
        }
        return `heute um ${actionTime.format("HH:mm")} Uhr`;
    } else if (now.isSame(actionTime.subtract(1, "day"), "day")) {
        if (dateOnly) {
            return `morgen`;
        }
        return `morgen um ${actionTime.format("HH:mm")} Uhr`;
    } else if (now.isSame(actionTime.add(1, "day"), "day")) {
        if (dateOnly) {
            return `gestern`;
        }
        return `gestern um ${actionTime.format("HH:mm")} Uhr`;
    } else if (dateOnly) {
        return `am ${actionTime.format("DD.MM.")} (${actionTime.fromNow()})`;
    }
    return `am ${actionTime.format("DD.MM.")} um ${actionTime.format(
        "HH:mm",
    )} Uhr (${actionTime.fromNow()})`;

    return "am Ende aller Tage";
}
