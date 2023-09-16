import NavigationBar from "@/components/Navigation/Navigation";
import styles from "./LandingPage.module.scss";

function LandingPage() {
  return (
    <>
      <NavigationBar />
      <div className={styles.LandingPage}>Landing Page</div>
    </>
  );
}

export default LandingPage;
