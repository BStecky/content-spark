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

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const router = useRouter();
  const { userProfile } = useUserProfile(user?.uid);
  const hasProfile = userProfile !== null;

  useEffect(() => {
    if (!loadingProfile && !hasProfile) {
      router.push("/getstarted");
    }
  }, [loadingProfile, hasProfile, router]);
  return (
    <PrivateRoute>
      <div className="h-full">
        <Navbar />
        <div className="container mx-auto">
          <h1 className="text-3xl text-primary font-bold text-center pt-10">
            Dashboard
          </h1>
          {user ? (
            <main className="grid w-full grid-cols-1 md:grid-cols-2 justify-center">
              <section className="w-full">
                <div className="m-4">
                  <UserCard />
                </div>
                <div className="m-4">
                  <GeneratedTweetsCard />
                </div>
              </section>
              <section className="w-full">
                <div className="my-4">
                  <GenerateContentCard user={user} userProfile={userProfile} />
                </div>
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
