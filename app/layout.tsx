import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConfigureAmplifyClientSide from "./ConfigureAmplifyClientSide";
import { Typography } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Swinx Web",
    description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className} style={{ height: "100vh", width: "100vw" }}>
                <ConfigureAmplifyClientSide />
                <div>{children}</div>
            </body>
        </html>
    );
}
