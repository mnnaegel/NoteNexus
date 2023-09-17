import NavigationBar from "@/components/Header/Header";
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
