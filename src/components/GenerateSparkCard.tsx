import { createBasicSparkPrompt } from "@/utils/contentUtils";
import { User, UserProfile } from "firebase/auth";
import React from "react";
import { useState } from "react";
import { generateContent } from "@/api/openai";

interface GenerateSparkCardProps {
  user: User | null;
  userProfile: UserProfile;
}

const GenerateSparkCard: React.FC<GenerateSparkCardProps> = ({
  user,
  userProfile,
}) => {
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
  const [generatedText, setGeneratedText] = useState("");
  const [editedContent, setEditedContent] = useState("");
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
      selectedTheme,
      selectedKeywords
    );
    const options = {
      message: prompt,
      context:
        "You are a professional content creator assistant here to help create ideas.",
      maxTokens: 200,
      n: 1,
      temperature: 0.7,
    };

    try {
      console.log("sparking idea...");
      const response = await generateContent(options);
      if (response && response.length > 0) {
        console.log("Generated text: ", response);
        setEditedContent(response);
        setShowModal(true);
        setSparkingIdea(false);
      } else {
        console.log("No content was generated.");
        setSparkingIdea(false);
      }
    } catch (error: unknown) {
      console.error("Error generating content:", error);
    }
  };

  // const handleSave = () => {
  //   const contentCategory = selectedPlatform.toLowerCase().concat(contentType);
  //   if (user) {
  //     saveGeneratedContent(user?.uid, editedContent, contentCategory);
  //   }
  //   setShowModal(false);
  // };

  const handleDelete = () => {
    setShowModal(false);
  };

  return (
    <div className="w-[100%] h-full card bg-base-300 mx-auto p-10 shadow-xl">
      <div className="card-body mx-auto">
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
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
              {
                handleSubmit;
              }
            }}
          >
            {sparkingIdea ? "Sparking..." : "Spark Ideas!"}
          </button>
        </form>
      </div>
      {user?.uid && showModal && (
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
                {/* <button onClick={handleSave} className="btn btn-primary mx-2">
                  Save
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateSparkCard;
