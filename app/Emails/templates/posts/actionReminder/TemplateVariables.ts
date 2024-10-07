export type TemplateVariables = {
    name: string;
    postTime: string;
    customerName: string;
    customerProfileLink: string;
    taskPageLink: string;
};

const templateBaseName = "PostReminder";
export const templateNames: { [key in "new" | "reduced"]: string } = {
    new: `${templateBaseName}New`,
    reduced: `${templateBaseName}Reduced`,
};
export const subjectLineBase = "Erinnerung: Beitragsveröffentlichung";
export const defaultParams: TemplateVariables = {
    name: "testName",
    postTime: "00:00",
    customerName: "TestCustomer",
    customerProfileLink: "https://www.swinx.de",
    taskPageLink: "https://www.swinx.de",
    // postContent: Array(10).fill("blablabla").join("\n"),
};
