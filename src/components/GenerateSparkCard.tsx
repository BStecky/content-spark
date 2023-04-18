import { createBasicSparkPrompt } from "@/utils/contentUtils";
import { User, UserProfile } from "firebase/auth";
import React from "react";
import { useState } from "react";

interface GenerateSparkCardProps {
  user: User | null;
  userProfile: UserProfile;
}

const GenerateSparkCard: React.FC = (user, userProfile) => {
  const themes = [
    "Inspirational",
    "Educational",
    "Entertaining",
    "Promotional",
    "Conversational",
    "Personal Experience",
  ];

  const keywords = [
    "Motivation",
    "Success",
    "Productivity",
    "Creativity",
    "Innovation",
    "Leadership",
    "Entrepreneurship",
    "Networking",
    "Work-life balance",
    "Sustainability",
  ];
  const [selectedTheme, setSelectedTheme] = React.useState(themes[0]);
  const [selectedKeywords, setSelectedKeywords] = useState<Array<string>>([]);
  const [sparkingIdea, setSparkingIdea] = useState(false);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    if (e.target.checked) {
      setSelectedKeywords((prevSelectedKeywords) => [
        ...prevSelectedKeywords,
        keyword,
      ]);
    } else {
      setSelectedKeywords((prevSelectedKeywords) =>
        prevSelectedKeywords.filter((k) => k !== keyword)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKeywords[0]) {
      alert("Please fill in the required fields.");
      return;
    }
    // Prepare the OpenAI API parameters
    const prompt = createBasicSparkPrompt(
      userProfile,
      selectedTheme,
      selectedKeywords
    );
    const options = {
      message: prompt,
      context:
        "You are a professional content creator assistant here to help anyone grow their business or brand.",
      maxTokens: 100,
      n: 1,
      temperature: 0.7,
    };
  };
  // const handleSave = () => {
  //   const contentCategory = selectedPlatform.toLowerCase().concat(contentType);
  //   if (user) {
  //     saveGeneratedContent(user?.uid, editedContent, contentCategory);
  //   }
  //   setShowModal(false);
  // };

  return (
    <div className="w-[100%] h-full card bg-base-300 mx-auto p-10 shadow-xl">
      <div className="card-body mx-auto">
        <h2 className="text-2xl card-title font-bold text-center">
          Spark Ideas
        </h2>
        <h3 className="text-center">Pick a theme.</h3>
        <div className="grid grid-cols-2 gap-2 justify-evenly p-4 max-w-md">
          {themes.map((theme) => (
            <div key={theme} className="form-control bg-base-100 rounded-lg">
              <label className="label cursor-pointer">
                <span className="label-text px-2">{theme}</span>
                <input
                  type="radio"
                  name="radio-10"
                  className={`radio checked:bg-primary `}
                  value={theme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  checked={selectedTheme === theme}
                />
              </label>
            </div>
          ))}
        </div>
        <h3 className="text-center">Select some key words.</h3>
        <div className="grid grid-cols-2 gap-2 justify-evenly p-4 max-w-md">
          {keywords.map((keyword) => (
            <div
              key={keyword}
              className="form-control bg-base-100 rounded-lg text-sm"
            >
              <label className="label cursor-pointer">
                <span className="label-text px-2">{keyword}</span>
                <input
                  className="checkbox checkbox-primary"
                  type="checkbox"
                  value={keyword}
                  onChange={handleKeywordChange}
                />
              </label>
            </div>
          ))}
        </div>
        <button
          className="btn btn-primary btn-sm m-2"
          onClick={async () => {
            setSparkingIdea(true);
            handleSubmit;
            // await generate prompt
            setTimeout(() => {
              setSparkingIdea(false);
            }, 2000);
          }}
        >
          {sparkingIdea ? "Sparking..." : "Spark Ideas!"}
        </button>
      </div>
    </div>
  );
};

export default GenerateSparkCard;
