import { EmailTriggers } from "@/app/ServerFunctions/types";
import { Button, Head, Hr, Html, Link, Preview, Text } from "@react-email/components";
import React from "react";
import { Placeholder, Signature } from "../_components";
import styles from "../styles";
import { DebugToggle, EmailProps } from "../types";
import DebugTemplates from "../../DebugTemplates";
import PlaceholderList from "../_components/placeholderList";
import { TemplateVariables, defaultParams } from "./TemplateVariables";

const placeholders: { [key in keyof TemplateVariables]: React.JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
    inviteAmount: Placeholder({ name: "inviteAmount" }),
    customerName: Placeholder({ name: "customerName" }),
    eventName: Placeholder({ name: "eventName" }),
    eventLink: Placeholder({ name: "eventLink" }),
    filterJobGroups: PlaceholderList({ parentName: "filterJobGroups", listItemName: "jobGroup" }),
    filterCountries: Placeholder({ name: "filterCountries" }),
    actionTime: Placeholder({ name: "actionTime" }),
    taskPageLink: Placeholder({ name: "taskPageLink" }),
};
const EmailTemplates: {
    [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => React.JSX.Element;
} = {
    new: (debug?) => <NewInvitesReminder debug={debug} />,
    reduced: (debug?) => <ReducedInvitesReminder debug={debug} />,
};

export default function InvitesReminderMail(props: EmailProps) {
    if (props.debug) return DebugTemplates({ templates: EmailTemplates });

    return EmailTemplates[props.emailLevel]();
}
InvitesReminderMail.PreviewProps = {
    emailLevel: "new",
    debug: true,
} satisfies EmailProps;

function NewInvitesReminder(props: DebugToggle) {
    const { name, inviteAmount, customerName, eventName, eventLink, filterCountries, actionTime, taskPageLink } =
        props.debug ? defaultParams : placeholders;
    const filterJobGroups = props.debug ? (
        <ul>
            {defaultParams.filterJobGroups.map((a, index) => (
                <li key={index}>{a.jobGroup}</li>
            ))}
        </ul>
    ) : (
        placeholders.filterJobGroups
    );
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Einladungen</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten sie daran erinnern, dass sie {actionTime} {inviteAmount} Einladungen für das Event{" "}
                <Link href={eventLink as string}>{eventName}</Link> von unserem Kunden {customerName} versenden sollen.
                <br />
                Bitte benutzen sie dafür unsere Browser Extension, mit ihrer personalisierten Filter-Datei, die sie von
                uns erhalten haben.
            </Text>
            <Text style={styles.text}>
                {`Bitte laden Sie im Anschluss einen Screenshot auf unserer Plattform hoch`}
            </Text>
            {/* <Container> */}
            <Button style={styles.responseButton} href={placeholders.taskPageLink.toString()}>
                Zur Übersicht
            </Button>
            {/* </Container> */}
            <Signature />
        </Html>
    );
}

function ReducedInvitesReminder(props: DebugToggle) {
    const { name, inviteAmount, customerName, eventName, eventLink, filterCountries, actionTime } = props.debug
        ? defaultParams
        : placeholders;
    const filterJobGroups = props.debug ? (
        <ul>
            {defaultParams.filterJobGroups.map((a, index) => (
                <li key={index}>{a.jobGroup}</li>
            ))}
        </ul>
    ) : (
        placeholders.filterJobGroups
    );
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>Erinnerung: Einladungen</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du {actionTime} {inviteAmount} Einladungen für das Event{" "}
                <Link href={eventLink as string}>{eventName}</Link> von unserem Kunden {customerName} versenden sollst.
                <br />
                Bitte schicke nur Einladungen an deine Follower*innen aus {filterCountries}, die folgenden Branchen
                tätig sind:
                <br />
                {filterJobGroups}
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
