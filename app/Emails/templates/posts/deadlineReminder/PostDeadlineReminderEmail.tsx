import { EmailTriggers } from "@/app/ServerFunctions/types";
import { Html, Button, Text, Head, Preview, Container, Hr } from "@react-email/components";
import styles from "../../styles";
import { Placeholder, Signature } from "../../_components";
import { DebugToggle, EmailProps } from "../../types";
import React from "react";
import DebugTemplates from "../../../DebugTemplates";
import { TemplateVariables, defaultParams } from "./TemplateVariables";

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
    customerName: Placeholder({ name: "customerName" }),
    topic: Placeholder({ name: "topic" }),
    actionTime: Placeholder({ name: "actionTime" }),
};
const EmailTemplates: {
    [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => JSX.Element;
} = {
    new: (debug?) => <NewPostDraftDeadlineReminder debug={debug} />,
    reduced: (debug?) => <ReducedDraftPostDeadlineReminder debug={debug} />,
};

export default function PostDraftDeadlineReminderEmail(props: EmailProps) {
    if (props.debug) return DebugTemplates({ templates: EmailTemplates });
    return EmailTemplates[props.emailLevel]();
}

PostDraftDeadlineReminderEmail.PreviewProps = {
    emailLevel: "new",
} satisfies EmailProps;

function NewPostDraftDeadlineReminder(props: DebugToggle) {
    const { name, customerName, topic, actionTime } = props.debug ? defaultParams : placeholders;
    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Erinnerung: Deadline für Beitragsentwurf</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten Sie daran erinnern, dass Sie bis {actionTime} noch einen Beitragsentwurf
                für den Kunden {customerName}
                {""}
                zum Thema {topic} bei uns einreichen müssen.
            </Text>
            <Signature />
        </Html>
    );
}

function ReducedDraftPostDeadlineReminder(props: DebugToggle) {
    const { name, customerName, topic } = props.debug ? defaultParams : placeholders;
    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Erinnerung: Deadline für Beitragsentwurf</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du noch einen Beitragsentwurf für den Kunden{" "}
                {customerName}
                zum Thema {topic} bei uns einreichen musst.
            </Text>
            <Signature />
        </Html>
    );
}
