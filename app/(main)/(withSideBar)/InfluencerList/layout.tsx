import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Influencer",
    // description: "Generated by create next app",
};
export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
