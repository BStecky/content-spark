import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/userProfileContext";
import { useEffect, useState } from "react";

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
  const [routePerformed, setRoutePerformed] = useState(false);

  useEffect(() => {
    if (!routePerformed) {
      if (!loading && !user) {
        router.push("/login");
        setRoutePerformed(true);
      } else if (!loading && user && !userProfile && !userProfileLoading) {
        router.push("/getStarted");
        setRoutePerformed(true);
      }
    }
  }, [user, loading, router, userProfile, userProfileLoading, routePerformed]);

  return <>{!loading && user && <div>{children}</div>}</>;
};

export default PrivateRoute;
