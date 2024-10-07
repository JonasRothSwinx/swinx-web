import { Body, Head, Heading, Html, Section, Link, Button, Text } from "@react-email/components";
import { Task } from "../types";

interface MediaUploadEmailProps {
    campaignId: string;
    eventId: string;
    // task: Task;
    event: Task["events"][number];
    customerName: string;
    influencerName: string;
    campaignUrl: string;
}
export function MediaUploadEmail({
    campaignId,
    eventId,
    // task,
    event,
    customerName,
    influencerName,
    campaignUrl,
}: MediaUploadEmailProps) {
    console.log("SubmitLinkEmail", {
        campaignId,
        eventId,
        event,
        customerName,
        influencerName,
        campaignUrl,
    });
    const taskType = event.timelineEventType;
    return (
        <Html>
            <Head>
                {/* <title>{influencerName} hat einen Beitrag veröffentlicht</title> */}
                <title>{`${influencerName} hat einen Beitrag veröffentlicht`}</title>
            </Head>
            <Body
                style={
                    {
                        // display: "flex",
                        // flexDirection: "column",
                        // gap: "10px",
                        // justifyContent: "center",
                    }
                }
            >
                <Heading as="h3">
                    {influencerName} hat Medien für {customerName} hochgeladen
                </Heading>
                {/* <Section style={{ paddingBottom: "10px" }}> */}
                <Text style={{}}>
                    {influencerName} hat Medien hochgeladen. (Aufgabentyp: {taskType})
                </Text>
                {/* </Section> */}

                <Section
                    style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
                >
                    <Button
                        href={campaignUrl ?? "<Link fehlt>"}
                        style={{
                            color: "white",
                            padding: "10px 20px",
                            margin: "auto",
                            border: "1px solid #61dafb",
                            backgroundColor: "#61dafb",
                        }}
                    >
                        Zur Kampagne
                    </Button>
                </Section>
            </Body>
        </Html>
    );
}
export default MediaUploadEmail;

MediaUploadEmail.PreviewProps = {
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
    campaignUrl: "campaignUrl",
} satisfies MediaUploadEmailProps;
