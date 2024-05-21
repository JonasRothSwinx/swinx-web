import { assignments } from "@/app/ServerFunctions/database/dbOperations";
import { Button, Container, Head, Html, Preview, Text } from "@react-email/components";
import styles from "../templates/styles";

interface InfluencerResponseEmailProps {
    accepted: boolean;
    InfluencerName: string;
    customerName: string;
}
export default function InfluencerResponseEmail({
    accepted,
    InfluencerName,
    customerName,
}: InfluencerResponseEmailProps) {
    switch (accepted) {
        case true: {
            return Accepted({ InfluencerName, customerName });
        }
        case false: {
            return Declined({ InfluencerName, customerName });
        }
    }
}

function Accepted({
    InfluencerName,
    customerName,
}: Omit<InfluencerResponseEmailProps, "accepted">) {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>{InfluencerName} möchte an der Kamapgne teilnehmen</Preview>
            <Text style={styles.text}>
                {InfluencerName} hat bestägtigt, dass er/sie an der Kampagne von {customerName}{" "}
                teilnehmen möchte.
            </Text>
        </Html>
    );
}
function Declined({
    InfluencerName,
    customerName,
}: Omit<InfluencerResponseEmailProps, "accepted">) {
    return (
        <Html dir="ltr" lang="de">
            <Head />
            <Preview>{InfluencerName} möchte nicht an der Kampagne teilnehmen</Preview>
            <Text style={styles.text}>
                {InfluencerName} hat abgelehnt, an der Kampagne von {customerName} teilzunehmen.
            </Text>
        </Html>
    );
}
