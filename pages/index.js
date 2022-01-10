import { useRouter } from "next/router";

function Home() {
  const router = useRouter();
  // Make sure we're in the browser
  if (typeof window !== "undefined") {
    router.push("/marketplace");
  }
  return null;
}

export default Home;
