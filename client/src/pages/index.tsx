import NavigationBar from "@/components/Header/Header";
import { SignIn, SignOutButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import styles from "../styles/Home.module.scss";
import { useEffect } from "react";
import router from "next/router";
import { CircularProgress } from "@mui/material";

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
            <h1 className={styles.Home__right__title}>
              The best way to write your notes!
            </h1>
            <p className={styles.Home__right__description}>
              Use NoteNexus to instantly create links between your notes
            </p>
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
