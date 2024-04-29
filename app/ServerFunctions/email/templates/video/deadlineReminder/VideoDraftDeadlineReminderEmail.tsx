import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { Html, Button, Text, Head, Preview, Container, Link } from "@react-email/components";
import styles from "../../styles";
import { Placeholder } from "../../_components";
import { DebugToggle, EmailProps } from "../../types";
import DebugTemplates from "../../../DebugTemplates";

export type TemplateVariables = {
    name: string;
    customerName: string;
    topic: string;
};
export const subjectLineBase = "Erinnerung: Entwurf für Video";
export const defaultParams: TemplateVariables = {
    name: "testName",
    customerName: "TestCustomer",
    topic: "TestTopic",
};

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
    customerName: Placeholder({ name: "customerName" }),
    topic: Placeholder({ name: "topic" }),
};
const EmailTemplates: { [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => JSX.Element } = {
    new: (debug?) => <NewVideoDraftDeadlineReminder />,
    reduced: (debug?) => <ReducedVideoDraftDeadlineReminder />,
};
export default function VideoDraftDeadlineReminderEmail(props: EmailProps) {
    if (props.debug) return DebugTemplates({ templates: EmailTemplates });
    return EmailTemplates[props.emailLevel]();
}

VideoDraftDeadlineReminderEmail.PreviewProps = {
    emailLevel: "new",
} satisfies EmailProps;

function NewVideoDraftDeadlineReminder(props: DebugToggle) {
    const { name, customerName, topic } = props.debug ? defaultParams : placeholders;
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Deadline für Video</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten sie daran erinnern, dass sie noch Video für den Kunden {customerName} zum Thema {topic} bei
                uns einreichen müssen.
            </Text>
        </Html>
    );
}

function ReducedVideoDraftDeadlineReminder(props: DebugToggle) {
    const { name, customerName, topic } = props.debug ? defaultParams : placeholders;
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Deadline für Video</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du noch ein Video für den Kunden {customerName} zum Thema {topic}{" "}
                bei uns einreichen musst.
            </Text>
        </Html>
    );
}
