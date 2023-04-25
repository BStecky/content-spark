import React from "react";
import UserCard from "@/components/UserCard";
import { CustomUserProfile } from "@/utils/firebase";
import { User } from "firebase/auth";

const DashboardSidebar: React.FC<{
  user: User;
  userProfile: CustomUserProfile | null;
}> = ({ user, userProfile }) => {
  return (
    <div className="bg-base-200 w-64 h-full p-4">
      <nav className="mt-8">
        <ul className="space-y-2">
          <li className="text-primary font-bold cursor-pointer">Profile</li>
          <li className="text-primary font-bold cursor-pointer">Generate</li>
          <li className="text-primary font-bold cursor-pointer">
            View Generated Content
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
