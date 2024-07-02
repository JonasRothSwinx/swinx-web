import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isBetween from "dayjs/plugin/isBetween";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import duration from "dayjs/plugin/duration";
import objectSupport from "dayjs/plugin/objectSupport";
import "dayjs/locale/de";

dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(localizedFormat);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(isSameOrAfter);
dayjs.extend(duration);
dayjs.extend(objectSupport);
dayjs.locale("de");

export { dayjs };
export { type Dayjs } from "dayjs";
