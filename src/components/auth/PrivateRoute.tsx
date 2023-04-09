import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/userProfileContext"; // Import the useUserProfile hook
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
  ); // Use the useUserProfile hook
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && user && !userProfile && !userProfileLoading) {
      router.push("/getStarted");
    }
  }, [user, loading, router, userProfile, userProfileLoading]);

  return <>{!loading && user && children}</>;
};

export default PrivateRoute;
