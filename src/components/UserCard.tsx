import React from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useUserProfile } from "@/hooks/userProfileContext";
import { calculateApiUsagePercentage } from "@/utils/planUtils";

const UserCard: React.FC = () => {
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.uid);

  return (
    <section className="card bg-base-200 w-[100%] shadow-xl">
      <div className="card-body flex flex-row justify-center align-middle">
        <div className="">
          <h1 className="card-title">
            Welcome back - {userProfile?.businessName}
          </h1>
          <h2 className="text-lg font-bold underline">Profile Info</h2>
          <p>{userProfile?.userType}</p>
          <p>Plan Type: {userProfile?.planId}</p>
          <p>Description: {userProfile?.businessDescription}</p>
          <p>Target Audience: {userProfile?.targetAudience}</p>
        </div>
        <div className="m-auto card card-body bg-base-100 items-center text-center justify-center">
          <h2 className="font-bold text-lg text-center">Sparks</h2>
          <div
            className="radial-progress text-primary"
            style={
              {
                "--value": calculateApiUsagePercentage(userProfile),
              } as React.CSSProperties
            }
          >
            {Math.round(calculateApiUsagePercentage(userProfile))}%
          </div>
          <p className="text-xs">Api Calls Left</p>
        </div>
      </div>
    </section>
  );
};

export default UserCard;
