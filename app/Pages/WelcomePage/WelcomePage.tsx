import { Schema } from "@/amplify/data/resource";
import { useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { FetchUserAttributesOutput, fetchUserAttributes } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import TodosList from "../../todosList";
import Image from "next/image";
import styles from "./welcomePage.module.css";
import UserView from "./User";
import TodoCreateForm from "@/ui-components/TodoCreateForm";
import InfluencerList from "../InfluencerMenu/InfluencerList";
import InfluencerPublicCreateForm from "@/ui-components/InfluencerPublicCreateForm";
import InfluencerPrivateCreateForm from "@/ui-components/InfluencerPrivateCreateForm";
import InfluencerPublicUpdateForm from "@/ui-components/InfluencerPublicUpdateForm";
import SideBar, { sideBarButtonId } from "./SideBar";
import InfluencerMenu from "../InfluencerMenu/InfluencerMenu";

const client = generateClient<Schema>();

async function createTodo() {
    const content = window.prompt("Todo Content");

    const { errors, data: newTodo } = await client.models.Todo.create({ content });
    console.log({ errors, newTodo });
}
function WelcomePage({}) {
    const { signOut, user, authStatus } = useAuthenticator((context) => [
        context.user,
        context.authStatus,
    ]);
    const [openMenu, setOpenMenu] = useState<sideBarButtonId>(sideBarButtonId.campaigns);
    if (authStatus !== "authenticated") return null;

    return (
        <main className={styles.main}>
            <div className={styles.mainContent}>
                {openMenu}
                <br />
                {openMenu === sideBarButtonId.campaigns && <></>}
                {openMenu === sideBarButtonId.influencers && <InfluencerMenu />}
                {/* <div className={styles.description}>
                    <TodosList />
                    <button onClick={createTodo}>Add Todo</button>
                </div>
                <TodoCreateForm /> */}
                {/* 
                <div className={styles.center}>
                    <Image
                        className={styles.logo}
                        src="/next.svg"
                        alt="Next.js Logo"
                        width={180}
                        height={37}
                        priority
                    />
                    <span>+</span>
                    <Image src="/amplify.svg" alt="Amplify Logo" width={45} height={37} priority />
                </div>

                <div className={styles.grid}></div> */}
            </div>
            <SideBar setMenuCallback={setOpenMenu} />
        </main>
    );
}

export default withAuthenticator(WelcomePage);
