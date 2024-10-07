export type TemplateVariables = {
    name: string;
    customerName: string;
    topic: string;
    actionTime: string;
    taskPageLink: string;
};
const templateBaseName = "PostDraftDeadlineReminder";
export const templateNames: { [key in "new" | "reduced"]: string } = {
    new: `${templateBaseName}New`,
    reduced: `${templateBaseName}Reduced`,
};
export const subjectLineBase = "Erinnerung: Entwurf für Beitrag";
export const defaultParams: TemplateVariables = {
    name: "testName",
    customerName: "TestCustomer",
    topic: "TestTopic",
    actionTime: "am Ende aller Tage",
    taskPageLink: "https://www.swinx.de",
};
