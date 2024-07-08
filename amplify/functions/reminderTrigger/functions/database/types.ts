import { Prettify } from "@/app/Definitions/types";
import * as dbOps from "./dbOperations";

export type RawEmailTrigger = Prettify<
    Awaited<ReturnType<typeof dbOps.getEmailTriggersForDateRange>>
>[number];
export type RawEvent = Prettify<Awaited<ReturnType<typeof dbOps.getEventForEmailTrigger>>>;
