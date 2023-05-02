import React from "react";
import { useUserProfile } from "@/hooks/userProfileContext";
import { calculateApiUsagePercentage } from "@/utils/planUtils";
import { CustomUserProfile } from "@/utils/firebase";

interface UserPlanCardProps {
  userProfile: CustomUserProfile;
}

const UserPlanCard: React.FC<UserPlanCardProps> = ({ userProfile }) => {
  return (
    <div className="m-auto card bg-base-200 items-center h-full text-center justify-center w-96 shadow-md border border-black">
      <div className="flex flex-col p-8 items-center text-center">
        <section className="p-2">
          <div className="bg-base-100 rounded-full p-2">
            <div
              className="radial-progress text-primary "
              style={
                {
                  "--value": calculateApiUsagePercentage(userProfile),
                } as React.CSSProperties
              }
            >
              {Math.round(calculateApiUsagePercentage(userProfile))}%
            </div>
          </div>
        </section>
        <h1 className="card-title">User Plan: {userProfile.planId}</h1>
        <p className="text-s">{20 - userProfile.apiCallUsage} Api Calls Left</p>
      </div>
    </div>
  );
};

export default UserPlanCard;
