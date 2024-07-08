export type TemplateVariables = {
    name: string;
    time: string;
    webinarTitle: string;
    topic: string;
};

const templateBaseName = "WebinarSpeakerActionReminder";
export const templateNames: { [key in "new" | "reduced"]: string } = {
    new: `${templateBaseName}New`,
    reduced: `${templateBaseName}Reduced`,
};
