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

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [activeTab, setActiveTab] = useState("generateContent");
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
      <div className="h-full md:h-screen">
        <Navbar />
        <div className="container mx-auto">
          <h1 className="text-3xl text-primary font-bold text-center p-2">
            Dashboard
          </h1>
          {user ? (
            <main className="grid w-full grid-cols-1 md:grid-cols-2 justify-center">
              <section className="w-full">
                <div className="pt-4 px-2">
                  <UserCard />
                </div>
                <div className="py-4 px-2">
                  <GeneratedTweetsCard />
                </div>
              </section>
              <section className="w-full p-4 flex flex-col">
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
                    className={`tab  ${
                      activeTab === "generateContent" ? "tab-active" : ""
                    } `}
                    onClick={() => handleTabClick("generateContent")}
                  >
                    Generate 💻
                  </a>

                  {/* <a className="tab">Tab 3</a> */}
                </div>
                {(() => {
                  switch (activeTab) {
                    case "generateContent":
                      return (
                        <GenerateContentCard
                          user={user}
                          userProfile={userProfile}
                        />
                      );
                    case "spark":
                      return <GenerateSparkCard />;
                    default:
                      return null;
                  }
                })()}
              </section>
            </main>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
};
export default DashboardPage;
