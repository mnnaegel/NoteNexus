import NavigationBar from "@/components/Navigation/Navigation";
import { SignIn, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import styles from "../styles/Home.module.scss";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  console.log(user);

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
      YOU ARE SIGNED IN
      <UserButton />
    </div>
  );
}
