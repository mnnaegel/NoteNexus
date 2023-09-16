import NavigationBar from "@/components/Navigation/Navigation";
import { SignIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  console.log(user);

  return (
    <>
      <SignIn />
      <NavigationBar />
    </>
  );
}
