import React from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useUserProfile } from "@/hooks/userProfileContext";

const UserCard: React.FC = () => {
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.uid);

  return (
    <div className="card bg-base-300 w-[100%] shadow-xl">
      <div className="card-body">
        <h1 className="card-title">Welcome back - {user?.email}</h1>
        <h2 className="text-lg font-bold underline">Profile Info</h2>
        <p>User Type: {userProfile?.userType}</p>
        <p>Business Name: {userProfile?.businessName}</p>
        <p>Business Description: {userProfile?.businessDescription}</p>
        <p>Target Audience: {userProfile?.targetAudience}</p>
        <p>Platforms: {userProfile?.platforms.join(", ")}</p>
      </div>
    </div>
  );
};

export default UserCard;
