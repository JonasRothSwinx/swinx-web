export type TemplateVariables = {
    name: string;
    inviteAmount: string;
    customerName: string;
    eventName: string;
    eventLink: string;
    // filterJobGroups: { jobGroup: string }[];
    // filterCountries: string;
    actionTime: string;
    taskPageLink: string;
};

export const defaultParams: TemplateVariables = {
    name: "testName",
    inviteAmount: "5 Millionen",
    customerName: "TestCustomer",
    eventName: "TestEvent",
    eventLink: "https://www.swinx.de",
    // filterJobGroups: [
    //     { jobGroup: "TestJobGroup1" },
    //     { jobGroup: "TestJobGroup2" },
    //     { jobGroup: "TestJobGroup3" },
    // ],
    // filterCountries: "TestCountry",
    actionTime: "am Ende aller Tage",
    taskPageLink: "https://www.swinx.de",
};

export const subjectLineBase = "Erinnerung: Einladungen";

const templateBaseName = "InvitesReminder";
export const templateNames: { [key in "new" | "reduced"]: string } = {
    new: `${templateBaseName}New`,
    reduced: `${templateBaseName}Reduced`,
};
