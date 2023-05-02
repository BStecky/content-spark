import React from "react";
import UserCard from "@/components/UserCard";
import { CustomUserProfile } from "@/utils/firebase";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import {
  ChartBarIcon,
  SparklesIcon,
  PencilSquareIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

const DashboardSidebar: React.FC<{
  user: User;
  userProfile: CustomUserProfile | null;
}> = ({ user, userProfile }) => {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActive = (path: string) => {
    return router.pathname === path ? "bg-base-300 p-3 border" : "";
  };

  return (
    <div className="bg-base-200 w-16 md:w-48 lg:w-64 h-full min-h-screen fixed flex justify-center border border-r-black">
      <nav className="flex flex-col justify-between w-full">
        <section>
          <div className="bg-base-300 w-[100%] p-2 md:p-6 text-center">
            <div className="bg-base-200 p-4 rounded-lg border border-black">
              <h1 className="font-bold text-lg hidden md:block">
                Content Spark ✨
              </h1>
              <span className="md:hidden">✨</span>
            </div>
          </div>
          <div className="p-4 mt-4">
            <ul className="space-y-4 flex flex-col items-center md:items-start">
              <div className="lg:w-[90%]">
                <Link href="/dashboard" className="w-full">
                  <li
                    className={`cursor-pointer flex gap-2 w-full p-2 hover:border hover:border-black hover:shadow-md rounded-md ease-in-out duration-100 ${isActive(
                      "/dashboard"
                    )}`}
                  >
                    {" "}
                    <ChartBarIcon className="h-6 w-6" />
                    <span className="hidden md:block">Dashboard</span>
                  </li>
                </Link>
              </div>
              <div className="lg:w-[90%]">
                <Link href="/generate">
                  <li
                    className={`cursor-pointer flex gap-2 w-full p-2 hover:border hover:border-black hover:shadow-md rounded-md ease-in-out duration-100 ${isActive(
                      "/generate"
                    )}`}
                  >
                    {" "}
                    <SparklesIcon className="h-6 w-6 items-center" />
                    <span className="hidden md:block">Generate Content</span>
                  </li>
                </Link>
              </div>
              <div className="lg:w-[90%]">
                <Link href="/viewContent">
                  <li
                    className={`cursor-pointer flex gap-2 w-full p-2 hover:border hover:border-black hover:shadow-md rounded-md ease-in-out duration-100 ${isActive(
                      "/viewContent"
                    )}`}
                  >
                    {" "}
                    <PencilSquareIcon className="h-6 w-6 items-center" />
                    <span className="hidden md:block">View Content</span>
                  </li>
                </Link>
              </div>
              <div className="lg:w-[90%]">
                <Link href="/profile">
                  <li
                    className={`cursor-pointer flex gap-2 w-full p-2 hover:border hover:border-black hover:shadow-md rounded-md ease-in-out duration-100 ${isActive(
                      "/profile"
                    )}`}
                  >
                    {" "}
                    <UserCircleIcon className="h-6 w-6 items-center" />
                    <span className="hidden md:block">Profile</span>
                  </li>
                </Link>
              </div>
            </ul>
          </div>
        </section>
        <section>
          <div className="space-y-8 flex flex-col items-center md:items-start p-2">
            <div
              className="flex gap-2 p-2 m-2 cursor-pointer hover:border hover:border-black hover:shadow-md rounded-md ease-in-out duration-100 "
              onClick={handleSignOut}
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6 items-center" />
              <p className="hidden md:block">Logout</p>
            </div>
          </div>
        </section>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
