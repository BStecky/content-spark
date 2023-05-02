import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/userProfileContext";
import { generateContent } from "../api/openai";
import { UserProfile } from "firebase/auth";
import { saveGeneratedContent } from "@/utils/contentUtils";

import PrivateRoute from "@/components/auth/PrivateRoute";
import Navbar from "@/components/Navbar";
import UserCard from "@/components/UserCard";
import GenerateContentCard from "@/components/GenerateContentCard";
import GeneratedTweetsCard from "@/components/GeneratedTweetsCard";
import GenerateSparkCard from "@/components/GenerateSparkCard";
import GeneratedIdeasCard from "@/components/GeneratedIdeasCard";
import DashboardSidebar from "@/components/DashboardSidebar";
import UserPlanCard from "@/components/UserPlanCard";
import SuggestedContentCard from "@/components/SuggestedContentCard";
import Link from "next/link";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [activeTab, setActiveTab] = useState("spark");
  const router = useRouter();
  const { userProfile } = useUserProfile(user?.uid);
  const hasProfile = userProfile !== null;

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    if (!loadingProfile && !hasProfile) {
      router.push("/getstarted");
    }
  }, [loadingProfile, hasProfile, router]);
  return (
    <PrivateRoute>
      {user && userProfile ? (
        <div className="min-h-screen flex bg-base-300">
          <DashboardSidebar
            user={user}
            userProfile={userProfile}
          ></DashboardSidebar>
          <div className="ml-16 md:ml-48 lg:ml-64 mx-auto flex flex-row p-4 max-h-screen w-full">
            <main className="w-full">
              <div className="navbar bg-base-200 text-primary-content rounded-lg shadow-md border border-black">
                <a className="p-2 font-bold normal-case text-xl">
                  <span className="text-primary">
                    {userProfile?.businessName}
                  </span>
                </a>
              </div>
              <section className="flex flex-wrap lg:w-full gap-4">
                <div className="py-4 mx-auto">
                  <UserCard />
                </div>
                <div className="py-4 mx-auto">
                  <UserPlanCard userProfile={userProfile} />
                </div>
                <div className="py-4 mx-auto">
                  <SuggestedContentCard />
                </div>
                {/* <div className="py-4 mx-auto">
                  {(() => {
                    switch (activeTab) {
                      case "generateContent":
                        return <GeneratedTweetsCard />;
                      case "spark":
                        return <GeneratedIdeasCard />;
                      default:
                        return null;
                    }
                  })()}
                </div> */}
                <div className="py-4 mx-auto">
                  <div className="gap-4 w-96 h-full card bg-base-200 justify-center border border-black shadow-md">
                    <div className="flex flex-col p-8 items-center text-center">
                      <Link href="/generate" className="w-full">
                        <div className="btn btn-primary m-4 w-[80%]">
                          Create Content
                        </div>
                      </Link>
                      <Link href="/viewContent" className="w-full">
                        <div className="btn btn-primary w-[80%]">
                          View Content
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <button className="btn btn-ghost loading">Loading...</button>
        </div>
      )}
    </PrivateRoute>
  );
};
export default DashboardPage;
