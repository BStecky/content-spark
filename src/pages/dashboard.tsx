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
      {user ? (
        <div className="min-h-screen flex bg-base-300">
          <DashboardSidebar
            user={user}
            userProfile={userProfile}
          ></DashboardSidebar>
          <div className="ml-16 md:ml-48 lg:ml-64 mx-auto flex flex-row p-10 max-h-screen">
            <main className="">
              <section className="grid lg:grid-cols-2 lg:w-full">
                <div className="py-4 px-2">
                  <UserCard />
                </div>
                <div className="py-4 px-2">
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
                </div>
              </section>
            </main>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </PrivateRoute>
  );
};
export default DashboardPage;
