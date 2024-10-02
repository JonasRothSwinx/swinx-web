import { Button, Container, Head, Html, Preview, Text } from "@react-email/components";
import styles from "../../../Emails/templates/styles";
import { Candidates } from "@/app/ServerFunctions/types";

interface InfluencerResponseEmailProps {
    response: Candidates.candidateResponse;
    influencerName: string;
    customerCompany: string;
    feedback?: string;
}
export default function InfluencerResponseEmail({
    response,
    influencerName,
    customerCompany,
    feedback,
}: InfluencerResponseEmailProps) {
    switch (response) {
        case "accepted": {
            return Accepted({ influencerName: influencerName, customerCompany, feedback });
        }
        case "rejected": {
            return Declined({ influencerName: influencerName, customerCompany, feedback });
        }
        case "pending": {
            return Pending(influencerName, customerCompany);
        }
    }
}

function Accepted({
    influencerName,
    customerCompany,
    feedback,
}: Omit<InfluencerResponseEmailProps, "response">) {
    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>{influencerName} möchte an der Kamapgne teilnehmen</Preview>
            <Text style={styles.text}>
                {influencerName} hat bestägtigt, dass er/sie an der Kampagne von {customerCompany}{" "}
                teilnehmen möchte.
            </Text>
            {feedback && (
                <Text>
                    Feedback: {feedback}
                    <br />
                </Text>
            )}
        </Html>
    );
}
function Declined({
    influencerName: InfluencerName,
    customerCompany,
    feedback,
}: Omit<InfluencerResponseEmailProps, "response">) {
    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>{InfluencerName} möchte nicht an der Kampagne teilnehmen</Preview>
            <Text style={styles.text}>
                {InfluencerName} hat abgelehnt, an der Kampagne von {customerCompany} teilzunehmen.
            </Text>
            {feedback && (
                <Text>
                    Feedback: {feedback}
                    <br />
                </Text>
            )}
        </Html>
    );
}

function Pending(InfluencerName: string, customerCompany: string): React.JSX.Element {
    return (
        <Html
            dir="ltr"
            lang="de"
        >
            <Head />
            <Preview>{InfluencerName} hat seine Entscheidung geändert</Preview>
            <Text style={styles.text}>
                {InfluencerName} hat seine vorherige Entscheidung zurückgesetzt und wird sich neu
                über die Teilnahme an der Kampagne von {customerCompany} entscheiden..
            </Text>
        </Html>
    );
}
