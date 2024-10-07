import { EmailTriggers } from "@/app/ServerFunctions/types";
import { Html, Button, Text, Head, Preview, Container, Hr } from "@react-email/components";
import { Placeholder, Signature } from "../_components";
import styles from "../styles";
import { DebugToggle, EmailProps } from "../types";
import React from "react";
import DebugTemplates from "../../DebugTemplates";
import { TemplateVariables } from "./TemplateVariables";

export const defaultParams: TemplateVariables = {
    name: "Max Mustermann",
    customerName: "Musterfirma",
    dueDate: "01.01.2022",
    topic: "Impulsvideo",
    taskPageLink: "https://example.com",
};

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
    customerName: Placeholder({ name: "customerName" }),
    dueDate: Placeholder({ name: "dueDate" }),
    topic: Placeholder({ name: "topic" }),
    taskPageLink: Placeholder({ name: "taskPageLink" }),
};

const EmailTemplates: {
    [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => JSX.Element;
} = {
    new: (debug?) => <NewReminder debug={debug} />,
    reduced: (debug?) => <ReducedReminder debug={debug} />,
};

export default function Email(props: EmailProps) {
    if (props.debug) return DebugTemplates({ templates: EmailTemplates });
    return EmailTemplates[props.emailLevel]();
}
Email.PreviewProps = {
    emailLevel: "new",
    debug: true,
} satisfies EmailProps;

export const subjectLineBase = "Erinnerung: Aufnahme für Impulsvideo";

function NewReminder(props: DebugToggle) {
    const { name, customerName, dueDate, topic } = props.debug ? defaultParams : placeholders;

    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Aufnahme für Impulsvideo</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                {`Wir möchten sie daran erinnern, dass sie uns bis spätestens ${dueDate} ihre Aufnahme für den Kunden ${customerName} zum Thema ${topic} zuschicken sollen.`}
            </Text>
            <Text style={styles.text}>
                {`Bitte laden Sie Ihre Aufnahme auf unserer Plattform hoch`}
            </Text>
            {/* <Container> */}
            <Button
                style={styles.responseButton}
                href={placeholders.taskPageLink.toString()}
            >
                Zur Übersicht
            </Button>
            {/* </Container> */}

            <Signature />
        </Html>
    );
}

function ReducedReminder(props: DebugToggle) {
    const { name, customerName, dueDate, topic } = props.debug ? defaultParams : placeholders;

    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Aufnahme für Impulsvideo</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                {`Wir möchten dich daran erinnern, dass du uns bis spätestens ${dueDate} deine Aufnahme für den Kunden ${customerName} zum Thema ${topic} zuschicken sollst.`}
            </Text>
        </Html>
    );
}
