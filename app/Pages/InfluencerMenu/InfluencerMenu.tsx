"use client";
import InfluencerList from "./InfluencerList";

import { QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();
function InfluencerMenu(props: {}) {
    return <InfluencerList />;
}

export default InfluencerMenu;
