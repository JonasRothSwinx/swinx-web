import { dayjs, Dayjs } from "@/app/utils";

interface DateToRangeProps {
    date: string | Dayjs;
    format?: string;
}
export default function dateToRange({ date: inputDate, format = "DD.MM" }: DateToRangeProps) {
    const date: Dayjs = typeof inputDate === "string" ? dayjs(inputDate) : inputDate;
    const startDate = date.startOf("week").format(format);
    const endDate = date.endOf("week").subtract(2, "days").format(format);
    return { startDate, endDate };
}
