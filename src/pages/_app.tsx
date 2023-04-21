import type { AppProps } from "next/app";
import { AuthProvider } from "../hooks/useAuth";
import "../styles/globals.css";
import { UserProfileProvider } from "@/hooks/userProfileContext";

function MyApp({ Component, pageProps }: AppProps) {
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
