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
          <div className="container mx-auto flex flex-row p-10 max-h-screen overflow-scroll">
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
              <section className="w-full col-span-2 px-2 flex flex-col mt-2">
                <div className="tabs tabs-boxed mx-auto">
                  <a
                    className={`tab ${
                      activeTab === "spark" ? "tab-active" : ""
                    }`}
                    onClick={() => handleTabClick("spark")}
                  >
                    Spark ✨
                  </a>
                  <a
                    className={`tab ${
                      activeTab === "generateContent" ? "tab-active" : ""
                    } `}
                    onClick={() => handleTabClick("generateContent")}
                  >
                    Generate 💻
                  </a>
                </div>
                {(() => {
                  switch (activeTab) {
                    case "generateContent":
                      return (
                        user &&
                        userProfile && (
                          <GenerateContentCard
                            user={user}
                            userProfile={userProfile}
                          />
                        )
                      );
                    case "spark":
                      return (
                        user &&
                        userProfile && (
                          <GenerateSparkCard
                            user={user}
                            userProfile={userProfile}
                          />
                        )
                      );
                    default:
                      return null;
                  }
                })()}
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
