export type TemplateVariables = {
    name: string;
    customerName: string;
    customerLink: string;
    // postContent: string;
    postTime: string;
    taskPageLink: string;
};

const templateBaseName = "VideoReminder";
export const templateNames: { [key in "new" | "reduced"]: string } = {
    new: `${templateBaseName}New`,
    reduced: `${templateBaseName}Reduced`,
};
export const defaultParams: TemplateVariables = {
    name: "testName",
    customerName: "TestCustomer",
    customerLink: "https://www.swinx.de",
    // postContent: "TestContent",
    postTime: "09:00",
    taskPageLink: "https://www.swinx.de",
};
export const subjectLineBase = "Erinnerung: Beitragsveröffentlichung";
