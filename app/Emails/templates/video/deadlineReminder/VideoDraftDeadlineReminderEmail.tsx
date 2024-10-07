import { EmailTriggers } from "@/app/ServerFunctions/types";
import { Html, Button, Text, Head, Preview, Container, Link } from "@react-email/components";
import styles from "../../styles";
import { Placeholder, Signature } from "../../_components";
import { DebugToggle, EmailProps } from "../../types";
import DebugTemplates from "../../../DebugTemplates";
import { TemplateVariables, defaultParams } from "./TemplateVariables";

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
    customerName: Placeholder({ name: "customerName" }),
    topic: Placeholder({ name: "topic" }),
    actionTime: Placeholder({ name: "actionTime" }),
    taskPageLink: Placeholder({ name: "taskPageLink" }),
};
const EmailTemplates: {
    [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => JSX.Element;
} = {
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
    const { name, customerName, topic, actionTime } = props.debug ? defaultParams : placeholders;
    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Erinnerung: Deadline für Video</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten sie daran erinnern, dass sie bis {actionTime} noch ein Video für den
                Kunden {customerName} zum Thema {topic} bei uns einreichen müssen.
            </Text>
            <Text style={styles.text}>
                Bitte laden Sie Ihre Aufnahme auf unserer Plattform hoch
            </Text>
            {/* <Container> */}
            <Button
                style={styles.responseButton}
                href={placeholders.taskPageLink.toString()}
            >
                Zur Übersicht
            </Button>
            <Signature />
        </Html>
    );
}

function ReducedVideoDraftDeadlineReminder(props: DebugToggle) {
    const { name, customerName, topic } = props.debug ? defaultParams : placeholders;
    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Erinnerung: Deadline für Video</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du noch ein Video für den Kunden{" "}
                {customerName} zum Thema {topic} bei uns einreichen musst.
            </Text>
            <Signature />
        </Html>
    );
}
