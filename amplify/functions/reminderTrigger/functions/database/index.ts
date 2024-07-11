"use server";
import * as dbOperations from "./dbOperations";

const dbClient = {
    getEmailTriggers: dbOperations.getEmailTriggersForDateRange,
};

export async function getDbClient() {
    return dbClient;
}

export * as types from "./types";
