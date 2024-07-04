import { EmailTriggers } from "@/app/ServerFunctions/types";
import { Head, Hr, Html, Link, Preview, Text } from "@react-email/components";
import React from "react";
import { Placeholder } from "../_components";
import styles from "../styles";
import { DebugToggle, EmailProps } from "../types";
import DebugTemplates from "../../DebugTemplates";
import PlaceholderList from "../_components/placeholderList";

export const subjectLineBase = "Erinnerung: Einladungen";
export type TemplateVariables = {
    name: string;
    inviteAmount: string;
    customerName: string;
    eventName: string;
    eventLink: string;
    filterJobGroups: { jobGroup: string }[];
    filterCountries: string;
};
export const defaultParams: TemplateVariables = {
    name: "testName",
    inviteAmount: "5 Millionen",
    customerName: "TestCustomer",
    eventName: "TestEvent",
    eventLink: "https://www.swinx.de",
    filterJobGroups: [
        { jobGroup: "TestJobGroup1" },
        { jobGroup: "TestJobGroup2" },
        { jobGroup: "TestJobGroup3" },
    ],
    filterCountries: "TestCountry",
};

const placeholders: { [key in keyof TemplateVariables]: JSX.Element | string } = {
    name: Placeholder({ name: "name" }),
    inviteAmount: Placeholder({ name: "inviteAmount" }),
    customerName: Placeholder({ name: "customerName" }),
    eventName: Placeholder({ name: "eventName" }),
    eventLink: Placeholder({ name: "eventLink" }),
    filterJobGroups: PlaceholderList({ parentName: "filterJobGroups", listItemName: "jobGroup" }),
    filterCountries: Placeholder({ name: "filterCountries" }),
};
const EmailTemplates: {
    [key in Exclude<EmailTriggers.emailLevel, "none">]: (debug?: boolean) => JSX.Element;
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
    const { name, inviteAmount, customerName, eventName, eventLink, filterCountries } = props.debug
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
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Erinnerung: Einladungen</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten sie daran erinnern, dass sie heute {inviteAmount} Einladungen für das
                Event <Link href={eventLink as string}>{eventName}</Link> von unserem Kunden{" "}
                {customerName} versenden sollen.
                <br />
                Bitte schicken sie nur Einladungen an ihre Follower*innen aus {filterCountries}, die
                folgenden Branchen tätig sind:
                <br />
                {filterJobGroups}
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

function ReducedInvitesReminder(props: DebugToggle) {
    const { name, inviteAmount, customerName, eventName, eventLink, filterCountries } = props.debug
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
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>Erinnerung: Einladungen</Preview>
            <Text style={styles.text}>Hallo {name}!</Text>
            <Text style={styles.text}>
                Wir möchten dich daran erinnern, dass du heute {inviteAmount} Einladungen für das
                Event <Link href={eventLink as string}>{eventName}</Link> von unserem Kunden{" "}
                {customerName} versenden sollst.
                <br />
                Bitte schicke nur Einladungen an deine Follower*innen aus {filterCountries}, die
                folgenden Branchen tätig sind:
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
