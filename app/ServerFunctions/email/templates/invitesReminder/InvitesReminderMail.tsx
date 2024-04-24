import { EmailTriggers } from "@/app/ServerFunctions/types/emailTriggers";
import { Head, Hr, Html, Link, Preview, Text } from "@react-email/components";
import React from "react";
import { Placeholder } from "../_components";
import styles from "../styles";
import { EmailProps } from "../types";

export const subjectLineBase = "Erinnerung: Einladungen";
export type TemplateVariables = {
    name: string;
    inviteAmount: string;
    customerName: string;
    eventName: string;
    eventLink: string;
};
export const defaultParams: TemplateVariables = {
    name: "testName",
    inviteAmount: "0",
    customerName: "TestCustomer",
    eventName: "TestEvent",
    eventLink: "https://www.swinx.de",
};

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
    inviteAmount: Placeholder({ name: "inviteAmount" }),
    customerName: Placeholder({ name: "customerName" }),
    eventName: Placeholder({ name: "eventName" }),
    eventLink: Placeholder({ name: "eventLink" }),
};
const EmailTemplates: { [key in Exclude<EmailTriggers.emailLevel, "none">]: JSX.Element } = {
    new: <NewInvitesReminder />,
    reduced: <ReducedInvitesReminder />,
};

export default function InvitesReminderMail(props: EmailProps) {
    if (props.debug) {
        return (
            <Html dir="ltr" lang="de">
                {Object.values(EmailTemplates).map((template, index) => (
                    <React.Fragment key={index}>
                        {template}
                        <Hr style={styles.largeDivider} />
                    </React.Fragment>
                ))}
            </Html>
        );
    }
    return EmailTemplates[props.emailLevel];
}
InvitesReminderMail.PreviewProps = {
    emailLevel: "new",
    debug: true,
} satisfies EmailProps;

function NewInvitesReminder() {
    const { name, inviteAmount, customerName, eventName, eventLink } = placeholders;
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Einladungen</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten sie daran erinnern, dass sie heute {inviteAmount} Einladungen für das Event{" "}
                <Link href={eventLink as string}>{eventName}</Link> von unserem Kunden {customerName} versenden sollen.
                <br />
                Bitte teilen sie uns danach mit, ob alles funktioniert hat.
            </Text>
            {/* <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container> */}
        </Html>
    );
}

function ReducedInvitesReminder() {
    const { name, inviteAmount, customerName, eventName, eventLink } = placeholders;
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Einladungen</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du heute {inviteAmount} Einladungen für das Event{" "}
                <Link href={eventLink as string}>{eventName}</Link> von unserem Kunden {customerName} versenden sollst.
                <br />
                Bitte teile uns danach mit, ob alles funktioniert hat.
            </Text>
            {/* <Container align="left" style={styles.buttonContainer}>
                <Button style={styles.responseButton} href="https://www.swinx.de">
                    Zu Swinx
                </Button>
            </Container> */}
        </Html>
    );
}
