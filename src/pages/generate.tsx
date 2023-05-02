import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/userProfileContext";
import { UserProfile } from "firebase/auth";
import PrivateRoute from "@/components/auth/PrivateRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import GenerateCardWrapper from "@/components/GenerateCardWrapper";
import { saveGeneratedContent } from "@/utils/contentUtils";

const GeneratePage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { userProfile } = useUserProfile(user?.uid);
  const hasProfile = userProfile !== null;
  const [activeTab, setActiveTab] = useState("generateContent");
  const [generatedContent, setGeneratedContent] = useState("");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleSave = () => {
    const contentCategory = "contentIdeas";
    if (user) {
      saveGeneratedContent(user?.uid, generatedContent, contentCategory);
    }
    alert("Your content has been saved!");
    setGeneratedContent("");
  };

  const handleDelete = () => {
    setGeneratedContent("");
  };

  const noGeneratedContent = !generatedContent.trim();

  return (
    <PrivateRoute>
      {user && userProfile ? (
        <div className="min-h-screen flex bg-base-300">
          <DashboardSidebar user={user} userProfile={userProfile} />
          <div className="w-full flex flex-row p-2 lg:py-6 lg:max-h-screen ml-16 md:ml-48 lg:ml-64">
            <main className="w-full px-2 flex flex-col lg:flex-row mt-2 lg:gap-4">
              <GenerateCardWrapper
                user={user}
                userProfile={userProfile}
                onGeneratedContent={setGeneratedContent}
              />
              <div className="w-[100%] lg:w-[50%] h-[40%] lg:h-[100%]">
                <div className="w-[100%] h-full lg:h-full card bg-base-200 mx-auto p-6 shadow-md lg:p-10 lg:mb-10 border border-black">
                  <textarea
                    className="textarea bg-base-100 h-full"
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    placeholder="Your content will display here."
                  ></textarea>
                  <div className="flex justify-center pt-2">
                    <button
                      className={`btn btn-error mx-2 ${
                        noGeneratedContent ? "btn-disabled" : ""
                      }`}
                      onClick={handleDelete}
                      type="button"
                      disabled={noGeneratedContent}
                    >
                      Delete
                    </button>
                    <button
                      className={`btn btn-primary mx-2 ${
                        noGeneratedContent ? "btn-disabled" : ""
                      }`}
                      onClick={handleSave}
                      type="button"
                      disabled={noGeneratedContent}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <button className="btn btn-square loading">Loading...</button>
        </div>
      )}
    </PrivateRoute>
  );
};

export default GeneratePage;
