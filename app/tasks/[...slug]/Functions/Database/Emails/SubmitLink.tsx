import { Body, Head, Heading, Html, Section, Link, Button, Text } from "@react-email/components";
import { Task } from "../types";
import { satisfies } from "@/app/ServerFunctions/types/customer";

interface SubmitLinkEmailProps {
    campaignId: string;
    eventId: string;
    // task: Task;
    event: Task["events"][number];
    customerName: string;
    influencerName: string;
    postLink: string;
}
export function SubmitLinkEmail({
    campaignId,
    eventId,
    // task,
    event,
    customerName,
    influencerName,
    postLink,
}: SubmitLinkEmailProps) {
    console.log("SubmitLinkEmail", {
        campaignId,
        eventId,
        event,
        customerName,
        influencerName,
        postLink,
    });
    return (
        <Html>
            <Head>
                {/* <title>{influencerName} hat einen Beitrag veröffentlicht</title> */}
                <title>{`${influencerName} hat einen Beitrag veröffentlicht`}</title>
            </Head>
            <Body
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    justifyContent: "center",
                }}
            >
                <Heading as="h1">
                    {influencerName} hat einen Beitragslink für {customerName} eingereicht
                </Heading>
                {/* <Section style={{ paddingBottom: "10px" }}> */}
                <Text style={{ textAlign: "center" }}>
                    {influencerName} hat einen Beitrag zum Thema {event.eventTitle} veröffentlicht!.
                </Text>
                {/* </Section> */}

                {/* <Section> */}
                <Button
                    href={postLink ?? "<Link fehlt>"}
                    style={{
                        color: "white",
                        padding: "10px 20px",
                        margin: "auto",
                        border: "1px solid #61dafb",
                        backgroundColor: "#61dafb",
                    }}
                >
                    Zum Beitrag
                </Button>
                {/* </Section> */}
            </Body>
        </Html>
    );
}
export default SubmitLinkEmail;

SubmitLinkEmail.PreviewProps = {
    campaignId: "campaignId",
    eventId: "eventId",
    event: {
        id: "eventId",
        eventTitle: "eventTitle",
        status: "WAITING_FOR_APPROVAL",
        date: "2022-01-01",
        timelineEventType: "Post",
        info: null,
        postLink: "postLink",
        parentEventId: "parentEventId",
        eventTaskAmount: 1,
        isCompleted: false,
    },
    customerName: "customerName",
    influencerName: "influencerName",
    postLink: "postLink",
} satisfies SubmitLinkEmailProps;
