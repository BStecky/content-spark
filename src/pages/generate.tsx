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
          <div className="container mx-auto flex flex-row p-10 md:max-h-screen">
            <main className="w-full px-2 flex flex-col md:flex-row mt-2 gap-4">
              <GenerateCardWrapper
                user={user}
                userProfile={userProfile}
                onGeneratedContent={setGeneratedContent}
              />
              <div className="w-[100%] md:w-[50%]">
                <div className="w-[100%] h-full card bg-base-200 mx-auto p-10 shadow-xl mb-10">
                  <textarea
                    className="textarea h-full bg-base-100"
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    placeholder="Your content will display here."
                  ></textarea>
                  <div className="flex justify-center p-2">
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
        <p>Loading...</p>
      )}
    </PrivateRoute>
  );
};

export default GeneratePage;
