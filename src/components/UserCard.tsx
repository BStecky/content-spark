import React from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useUserProfile } from "@/hooks/userProfileContext";

const UserCard: React.FC = () => {
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.uid);

  return (
    <div className="card glass bg-base-300 w-full md:w-auto">
      <div className="card-body">
        <h2 className="card-title">Profile Info</h2>
        <p>Welcome, {user?.email}!</p>
        <p>User Type: {userProfile?.userType}</p>
        <p>Business Name: {userProfile?.businessName}</p>
        <p>Business Description: {userProfile?.businessDescription}</p>
      </div>
    </div>
  );
};

export default UserCard;
