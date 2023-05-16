// _app.tsx
import type { AppProps } from "next/app";
import { AuthProvider } from "../hooks/useAuth";
import "../styles/globals.css";
import { UserProfileProvider } from "@/hooks/userProfileContext";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as gtag from "../utils/gtag";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    const scriptCheck = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).gtag) {
        clearInterval(scriptCheck);
      } else {
      }
    }, 1000);

    return () => {
      clearInterval(scriptCheck);
    };
  }, []);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gtag.GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
        }}
      />

      <AuthProvider>
        <UserProfileProvider>
          <div data-theme="bumblebee">
            <Component {...pageProps} />
          </div>
        </UserProfileProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
