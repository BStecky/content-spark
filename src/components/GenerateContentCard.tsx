import React, { useEffect, useState } from "react";
import { useUserProfile } from "@/hooks/userProfileContext";
import { User, UserProfile } from "firebase/auth";
import { generateContent } from "../api/openai";
import GeneratedContentModal from "./GeneratedContentModal";
import { createBasicPrompt, saveGeneratedContent } from "@/utils/contentUtils";
import { checkAndUpdateApiUsage } from "@/utils/planUtils";
import { CustomUserProfile } from "@/utils/firebase";

interface GenerateContentCardProps {
  user: User | null;
  userProfile: CustomUserProfile;
}

type PlatformContentOptions = {
  [key: string]: string[];
};

const platformContentOptions: PlatformContentOptions = {
  Twitter: ["Tweet", "Reply", "Thread"],
  LinkedIn: ["Post", "Reply"],
  // Add new platforms and their content options here
};

type PlatformContentSelectedOptions = {
  [key: string]: {
    inputs: Array<{
      id: string;
      label: string;
      placeholder: string;
      stateUpdater: (value: any) => void;
    }>;
  };
};

const GenerateContentCard: React.FC<GenerateContentCardProps> = ({
  user,
  userProfile,
}) => {
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [selectedPlatform, setSelectedPlatform] = useState("Twitter");
  const [threadLength, setThreadLength] = useState(2);
  const [contentType, setContentType] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const platformContentSelectedOptions: PlatformContentSelectedOptions = {
    Tweet: {
      inputs: [
        {
          id: "about",
          label: "About",
          placeholder: "Enter what the content should be about",
          stateUpdater: setAbout,
        },
      ],
    },
    Post: {
      inputs: [
        {
          id: "about",
          label: "About",
          placeholder: "Enter what the post should be about",
          stateUpdater: setAbout,
        },
      ],
    },
    Thread: {
      inputs: [
        {
          id: "about",
          label: "About",
          placeholder: "Enter what the thread should be about",
          stateUpdater: setAbout,
        },
      ],
    },
    Reply: {
      inputs: [
        {
          id: "reply-to",
          label: "Reply To",
          placeholder: "Enter the post to reply to",
          stateUpdater: setReplyTo,
        },
        {
          id: "about",
          label: "About",
          placeholder: "Enter what the reply should be about",
          stateUpdater: setAbout,
        },
      ],
    },
    // Add more content types and their input configurations here
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check if the required fields are filled
    if (
      !contentType ||
      (contentType === "reply" && !replyTo) ||
      (contentType !== "reply" && !about)
    ) {
      alert("Please fill in the required fields.");
      return;
    }
    // Prepare the OpenAI API parameters
    const prompt = createBasicPrompt(
      userProfile,
      contentType,
      replyTo,
      about,
      selectedTone,
      selectedPlatform,
      threadLength
    );
    const options = {
      message: prompt,
      context:
        "You are a professional content creator assistant here to help anyone grow their business or brand.",
      maxTokens: 300,
      n: 1,
      temperature: 0.7,
    };

    try {
      if ((await checkAndUpdateApiUsage(userProfile, 1)) == false) {
        console.log("Not enough API usage left.");
        return;
      }
      setLoading(true);
      const response = await generateContent(options);
      if (response && response.length > 0) {
        setGeneratedText(response);
        setEditedContent(response);
        setShowModal(true);
        setLoading(false);
      } else {
        console.log("No content was generated.");
      }
    } catch (error: unknown) {
      console.error("Error generating content:", error);
    }
  };

  const renderContentTypeOptions = (platform: string) => {
    return platformContentOptions[platform]?.map((contentOption: string) => (
      <div
        key={contentOption}
        className="form-control hover:outline outline-2 outline-primary bg-base-100 rounded-lg"
      >
        <div className="">
          <label className="label cursor-pointer">
            <span className="label-text px-2">
              {contentOption.charAt(0).toUpperCase() + contentOption.slice(1)}
            </span>
            <input
              type="radio"
              name="radio-content-type"
              className="radio checked:bg-primary"
              value={contentOption}
              onChange={(e) => setContentType(e.target.value)}
              checked={contentType === contentOption}
            />
          </label>
        </div>
      </div>
    ));
  };

  const handleSave = () => {
    const contentCategory = selectedPlatform.toLowerCase().concat(contentType);
    if (user) {
      saveGeneratedContent(user?.uid, editedContent, contentCategory);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setShowModal(false);
  };

  return (
    <div className="">
      <div className="">
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
          <h2 className="text-2xl card-title font-bold text-center">
            Generate Content
          </h2>
          <h3 className="text-md text-center">Platform:</h3>
          <div className="flex flex-wrap justify-evenly p-4 max-w-lg mx-auto">
            {/* Add more platforms to this array when I'm ready. */}
            {["Twitter"].map((platform) => (
              <div
                key={platform}
                className="form-control hover:outline outline-2 outline-primary bg-base-100 rounded-lg"
              >
                <label className="label cursor-pointer">
                  <span className="label-text px-2">{platform}</span>
                  <input
                    type="radio"
                    name="radio-10"
                    className={`radio checked:bg-primary `}
                    value={platform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    checked={selectedPlatform === platform}
                  />
                </label>
              </div>
            ))}
          </div>

          <h3 className="text-md text-center">Choose a tone:</h3>
          <div className="grid grid-cols-2 gap-2 justify-evenly p-4 max-w-lg mx-auto">
            {[
              "Professional",
              "Friendly",
              "Casual",
              "Humorous",
              "Inspirational",
            ].map((tone) => (
              <div
                key={tone}
                className="form-control hover:outline outline-2 outline-primary bg-base-100 rounded-lg"
              >
                <label className="label cursor-pointer">
                  <span className="label-text px-2">{tone}</span>
                  <input
                    type="radio"
                    name="radio-tone"
                    className={`radio checked:bg-primary`}
                    value={tone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    checked={selectedTone === tone}
                  />
                </label>
              </div>
            ))}
          </div>

          <h3 className="text-md text-center">Content Type:</h3>
          <div className="grid grid-cols-2 gap-2 p-4 max-w-lg mx-auto">
            {renderContentTypeOptions(selectedPlatform)}
          </div>
          {contentType === "Thread" && (
            <div className="w-full flex flex-col items-center">
              <label htmlFor="thread-length" className="text-md">
                Thread Length:
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (threadLength > 2) {
                      setThreadLength(threadLength - 1);
                    }
                  }}
                  className="btn btn-primary"
                >
                  -
                </button>
                <input
                  type=""
                  id="thread-length"
                  value={threadLength}
                  className="input input-bordered w-20 mx-2 text-center"
                  min="2"
                  max="10"
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 2 && value <= 10) {
                      setThreadLength(value);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (threadLength < 10) {
                      setThreadLength(threadLength + 1);
                    }
                  }}
                  className="btn btn-primary"
                >
                  +
                </button>
              </div>
            </div>
          )}
          {platformContentSelectedOptions[contentType]?.inputs.map((input) => (
            <div key={input.id} className="flex flex-col p-4">
              <label htmlFor={input.id} className="text-md">
                {input.label}
              </label>
              <textarea
                id={input.id}
                className="textarea textarea-bordered w-full"
                onChange={(e) => input.stateUpdater(e.target.value)}
                placeholder={input.placeholder}
                style={{ height: "125px" }}
              />
            </div>
          ))}
          {!loading ? (
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary m-4"
            >
              Generate
            </button>
          ) : (
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary m-4 loading"
            >
              Generating...
            </button>
          )}
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
                <button onClick={handleSave} className="btn btn-primary mx-2">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateContentCard;
