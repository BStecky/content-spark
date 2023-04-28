import React, { useState } from "react";
import GenerateContentCard from "./GenerateContentCard";
import GenerateSparkCard from "./GenerateSparkCard";
import { CustomUserProfile } from "@/utils/firebase";
import { User } from "firebase/auth";

interface GenerateCardWrapperProps {
  user: User | null;
  userProfile: CustomUserProfile;
  onGeneratedContent: (content: string) => void;
}

const GenerateCardWrapper: React.FC<GenerateCardWrapperProps> = ({
  user,
  userProfile,
  onGeneratedContent,
}) => {
  const [activeTab, setActiveTab] = useState("spark");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="w-[100%] md:w-[70%] h-full card bg-base-200 p-10 shadow-xl mb-10">
      <div className="tabs tabs-boxed mx-auto">
        <a
          className={`tab ${activeTab === "spark" ? "tab-active" : ""}`}
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
      {activeTab === "spark" && (
        <GenerateSparkCard
          user={user}
          userProfile={userProfile}
          onGeneratedContent={onGeneratedContent}
        />
      )}
      {activeTab === "generateContent" && (
        <GenerateContentCard user={user} userProfile={userProfile} />
      )}
    </div>
  );
};

export default GenerateCardWrapper;
