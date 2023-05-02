import React from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useUserProfile } from "@/hooks/userProfileContext";
import { calculateApiUsagePercentage } from "@/utils/planUtils";

const UserCard: React.FC = () => {
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.uid);

  return (
    <section className="card w-96 bg-base-200 shadow-md border border-black">
      <div className="card-body">
        <h1 className="card-title">
          Welcome back - {userProfile?.businessName}
        </h1>
        <h2 className="text-lg font-bold underline">Profile Info</h2>
        <p>{userProfile?.userType}</p>
        <p>Description: {userProfile?.businessDescription}</p>
        <p>Target Audience: {userProfile?.targetAudience}</p>
      </div>
    </section>
  );
};

export default UserCard;
