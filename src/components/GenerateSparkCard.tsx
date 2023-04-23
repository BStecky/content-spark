import { createBasicSparkPrompt } from "@/utils/contentUtils";
import { User, UserProfile } from "firebase/auth";
import React from "react";
import { useState } from "react";
import { generateContent } from "@/api/openai";
import { saveGeneratedContent } from "@/utils/contentUtils";
import {
  checkAndUpdateApiUsage,
  hasUserHitApiLimit,
  shouldResetApiLimit,
} from "@/utils/planUtils";
import { CustomUserProfile } from "@/utils/firebase";
import { collection } from "firebase/firestore";

interface GenerateSparkCardProps {
  user: User | null;
  userProfile: CustomUserProfile;
}

const GenerateSparkCard: React.FC<GenerateSparkCardProps> = ({
  user,
  userProfile,
}) => {
  const contentTypes = ["Tweet", "Post", "Anything!"];

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
    "Solopreneur",
    "Networking",
    "Work-life balance",
    "Sustainability",
  ];
  const [selectedTheme, setSelectedTheme] = React.useState(themes[0]);
  const [selectedType, setSelectedType] = React.useState(contentTypes[0]);
  const [selectedKeywords, setSelectedKeywords] = useState<Array<string>>([]);
  const [sparkingIdea, setSparkingIdea] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
      selectedType,
      selectedTheme,
      selectedKeywords
    );
    const options = {
      message: prompt,
      context:
        "You are a professional content creator assistant here to help create ideas.",
      maxTokens: 300,
      n: 1,
      temperature: 0.7,
    };

    try {
      if ((await checkAndUpdateApiUsage(userProfile, 1)) == false) {
        console.log("Not enough API usage left.");
        return;
      }
      console.log("sparking idea...");
      setSparkingIdea(true);
      const response = await generateContent(options);
      if (response && response.length > 0) {
        setEditedContent(response);
        // setShowModal(true);
        setEditing(true);
        setSparkingIdea(false);
      } else {
        console.log("No content was generated.");
        setSparkingIdea(false);
      }
    } catch (error: unknown) {
      console.error("Error generating content:", error);
    }
  };

  const handleSave = () => {
    const contentCategory = "contentIdeas";
    if (user) {
      saveGeneratedContent(user?.uid, editedContent, contentCategory);
    }
    // setShowModal(false);
    setEditing(false);
  };

  const handleDelete = () => {
    // setShowModal(false);
    setEditing(false);
  };

  return (
    <div className="w-[100%] h-full card bg-base-200 mx-auto p-10 shadow-xl">
      {!editing ? (
        <div className="card-body mx-auto">
          <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
            <h2 className="text-2xl card-title font-bold text-center">
              Spark Ideas
            </h2>
            <h3 className="text-center">Pick a type of content.</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 justify-evenly p-4 max-w-lg mx-auto">
              {contentTypes.map((type) => (
                <div
                  key={type}
                  className="form-control h-12 justify-center hover:outline outline-2 outline-primary bg-base-100 rounded-lg"
                >
                  <label className="label cursor-pointer">
                    <span className="label-text px-2">{type}</span>
                    <input
                      type="radio"
                      name="radio-9"
                      className={`radio checked:bg-primary `}
                      value={type}
                      onChange={(e) => setSelectedType(e.target.value)}
                      checked={selectedType === type}
                    />
                  </label>
                </div>
              ))}
            </div>
            <h3 className="text-center">Pick a theme.</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 justify-evenly p-4 max-w-lg mx-auto">
              {themes.map((theme) => (
                <div
                  key={theme}
                  className="form-control h-12 justify-center hover:outline outline-2 outline-primary bg-base-100 rounded-lg"
                >
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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 justify-evenly p-4 max-w-lg mx-auto">
              {keywords.map((keyword) => (
                <div
                  key={keyword}
                  className="form-control h-12 justify-center hover:outline outline-2 outline-primary bg-base-100 rounded-lg"
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
            <div className="px-4">
              <button
                className={`btn btn-primary btn-sm w-full max-w-lg ${
                  sparkingIdea ? "loading" : ""
                }`}
                onClick={async () => {
                  {
                    handleSubmit;
                  }
                }}
              >
                {sparkingIdea ? "Sparking..." : "Spark Ideas!"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <form className="max-w-lg mx-auto">
          <h2 className="text-2xl card-title font-bold text-center">
            Edit Generated Content
          </h2>
          <textarea
            className="textarea textarea-bordered w-[400px] h-[400px] lg:h-[600px] lg:w-[600px] mb-4"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{}}
          />
          <div className="flex justify-center">
            <button
              onClick={handleDelete}
              className="btn btn-error mx-2"
              type="button"
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary mx-2"
              type="button"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* {user?.uid && showModal && (
        <div>
          <input
            type="checkbox"
            id="generated-content-modal"
            className="modal-toggle"
            checked={showModal}
            readOnly
          />
          <div className="modal">
            <div className="modal-box">
              <h2 className="text-2xl font-bold mb-4">Generated Content</h2>
              <textarea
                className="textarea textarea-bordered w-full mb-4"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{ height: "175px" }}
              />
              <div className="modal-action">
                <button onClick={handleDelete} className="btn btn-error mx-2">
                  Delete
                </button>
                <button onClick={handleSave} className="btn btn-primary mx-2">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default GenerateSparkCard;
