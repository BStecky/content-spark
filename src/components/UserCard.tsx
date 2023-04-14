import React from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useUserProfile } from "@/hooks/userProfileContext";

const UserCard: React.FC = () => {
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.uid);

  return (
    <section className="card bg-base-300 w-[100%] shadow-xl">
      <div className="card-body flex flex-row justify-center align-middle">
        <div className="">
          <h1 className="card-title">
            Welcome back - {userProfile?.businessName}
          </h1>
          <h2 className="text-lg font-bold underline">Profile Info</h2>
          <p>User Type: {userProfile?.userType}</p>
          <p>Business Name: {userProfile?.businessName}</p>
          <p>Business Description: {userProfile?.businessDescription}</p>
          <p>Target Audience: {userProfile?.targetAudience}</p>
          <p>Platforms: {userProfile?.platforms.join(", ")}</p>
        </div>
        <div className="m-auto card card-body bg-base-100">
          <h2 className="font-bold text-lg text-center">Sparks</h2>
          <div
            className="radial-progress text-primary"
            style={{ "--value": 70 } as React.CSSProperties}
          >
            70%
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserCard;
