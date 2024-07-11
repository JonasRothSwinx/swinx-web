export type TemplateVariables = {
    name: string;
    customerName: string;
    topic: string;
    actionTime: string;
};
const templateBaseName = "VideoDraftDeadlineReminder";
export const templateNames: { [key in "new" | "reduced"]: string } = {
    new: `${templateBaseName}New`,
    reduced: `${templateBaseName}Reduced`,
};
export const subjectLineBase = "Erinnerung: Entwurf für Video";
export const defaultParams: TemplateVariables = {
    name: "testName",
    customerName: "TestCustomer",
    topic: "TestTopic",
    actionTime: "am Ende aller Tage",
};
