import NavigationBar from "@/components/Header/Header";
import { SignIn, SignOutButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import styles from "../styles/Home.module.scss";
import { useEffect } from "react";
import router from "next/router";
import { CircularProgress } from "@mui/material";
import logo from "../assets/temporaryLogo.png";
import Image from "next/image";

export default function Home() {
  const { user } = useUser();
  useEffect(() => {
    if (user) {
      router.push("/notes"); // Redirect to /notes if authenticated
    }
  }, [user]);

  return !user ? (
    <>
      <NavigationBar isNotLoggedIn />
      <div className={styles.Home}>
        <div className={styles.Home__container}>
          <SignIn />
          <div className={styles.Home__right}>
            <Image
              className={styles.Home__right__logo}
              src={logo}
              alt="logo"
              height={160}
              width={160}
            />

            <h1 className={styles.Home__right__title}>
              Revolutionizing the way you take notes
            </h1>
            <h3 className={styles.Home__right__subtitle}>
              Smarter notes with less work. Unlock Insights with NoteNexus
              effortlessly
            </h3>
            {/* <ul className={styles.Home__right__list}>
              <li className={styles.Home__right__list__item}>
                - Automatic note linking using large language models.
              </li>
              <li className={styles.Home__right__list__item}>
                - Insight discovery through automatic note insights.
              </li>
              <li className={styles.Home__right__list__item}>
                - Easy-to-use interface for note tracking and management.
              </li>
              <li className={styles.Home__right__list__item}>
                - Paragraph-level organization and linking.
              </li>
            </ul> */}
          </div>
        </div>
      </div>
    </>
  ) : (
    <div>
      <NavigationBar />
      <div className={styles.Home__auth}>
        <CircularProgress />
        You have signed in.
        <UserButton />
        <SignOutButton />
      </div>
    </div>
  );
}
