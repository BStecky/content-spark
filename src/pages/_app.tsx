import type { AppProps } from "next/app";
import { AuthProvider } from "../hooks/useAuth";
import "../styles/globals.css";
import { UserProfileProvider } from "@/hooks/userProfileContext";
import { GA_MEASUREMENT_ID, pageview } from "@/utils/analytics";
import { useEffect } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <AuthProvider>
      <UserProfileProvider>
        <div data-theme="bumblebee">
          <Component {...pageProps} />
        </div>
      </UserProfileProvider>
    </AuthProvider>
  );
}

export default MyApp;
