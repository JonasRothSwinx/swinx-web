"use server";
import * as dbOperations from "./dbOperations";

const dbClient = {
    getEmailTriggers: dbOperations.getEmailTriggersForDateRange,
    getEvent: dbOperations.getEventForEmailTrigger,
};

export default async function getDbClient() {
    return dbClient;
}
