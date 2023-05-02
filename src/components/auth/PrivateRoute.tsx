import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@//hooks/userProfileContext";
import { useEffect } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
  onCompleted?: () => void;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  onCompleted,
}) => {
  const { user, loading } = useAuth();
  const { userProfile, loading: userProfileLoading } = useUserProfile(
    user?.uid
  );
  const router = useRouter();

  useEffect(() => {
    if (!loading && !userProfileLoading) {
      if (!user) {
        router.push("/login");
      } else if (user && !userProfile) {
        if (router.asPath !== "/getStarted") {
          router.push("/getStarted");
          if (typeof window !== "undefined") {
            alert("Please complete your profile before continuing.");
          }
        }
      } else if (user && userProfile) {
        if (router.asPath === "/getStarted") {
          router.push("/dashboard");
        }
      }
    }
  }, [user, loading, router, userProfile, userProfileLoading]);

  return <>{!loading && user && <div>{children}</div>}</>;
};

export default PrivateRoute;
