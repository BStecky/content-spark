import React, { useEffect, useState } from "react";
import { useUserProfile } from "@/hooks/userProfileContext";
import { User, UserProfile } from "firebase/auth";
import { generateContent } from "../api/openai";
import { saveGeneratedContent } from "@/utils/contentUtils";

interface GenerateContentCardProps {
  user: User | null;
  userProfile: UserProfile;
}

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

  function createPrompt(
    userProfile: UserProfile,
    contentType: string,
    replyTo: string,
    about: string,
    selectedTone: string
  ): string {
    const businessName = userProfile.businessName;
    const targetType = userProfile.targetAudience;
    const tone = selectedTone.toLowerCase();
    let prompt = `
    I am a ${userProfile.userType} and I want to create a tweet. 
    Info about me or my business : ${userProfile.businessDescription}, ${businessName}. 
    Tweet Tone: ${tone} Target audience: ${targetType}. `;
    if (contentType === "reply") {
      prompt += `Reply to the following tweet: "${replyTo}". `;
    } else {
      prompt += `The ${contentType} should be about ${about}. `;
    }
    console.log("Completed prompt: ", prompt);
    return prompt;
  }

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
    const prompt = createPrompt(
      userProfile,
      contentType,
      replyTo,
      about,
      selectedTone
    );
    const options = {
      message: prompt,
      context: "Tweet Generator",
      maxTokens: 50,
      n: 1,
      temperature: 0.7,
    };

    try {
      const response = await generateContent(options);
      if (response && response.length > 0) {
        const generatedText = response;
        console.log("Generated text: ", generatedText);
        console.log("Platform: ", selectedPlatform);
        console.log("Content type: ", contentType);
        const contentCategory = selectedPlatform
          .toLowerCase()
          .concat(contentType);
        console.log("Content category: ", contentCategory);
        if (user) {
          saveGeneratedContent(user.uid, generatedText, contentCategory);
        }
        // Display the generated text or handle it as needed
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
        className="form-control hover:outline outline-2 outline-primary m-1 rounded-md ease-in-out-[0.2s]"
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

  return (
    <div className="w-[100%] h-full card bg-base-300 mx-auto p-10 shadow-xl">
      <div className="card-body">
        <h2 className="text-2xl card-title font-bold text-center">
          Generate Content
        </h2>
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
          <label htmlFor="platform" className="text-md">
            Platform:
          </label>
          <div className="flex flex-wrap justify-evenly p-4 max-w-md">
            {["Twitter", "LinkedIn"].map((platform) => (
              <div key={platform} className="form-control">
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

          <label htmlFor="tone" className="text-md">
            Choose a tone:
          </label>
          <div className="grid grid-cols-2 justify-evenly p-4 max-w-md">
            {[
              "Professional",
              "Friendly",
              "Casual",
              "Humorous",
              "Inspirational",
            ].map((tone) => (
              <div
                key={tone}
                className="form-control hover:outline outline-2 outline-primary m-1 rounded-md ease-in-out-[0.2s]"
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

          <label htmlFor="content-type" className="text-md">
            Content Type:
          </label>
          <div className="grid grid-cols-2 p-4 max-w-md">
            {renderContentTypeOptions(selectedPlatform)}
          </div>

          {contentType === "thread" && (
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
              />
            </div>
          ))}
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary m-4"
          >
            Generate
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateContentCard;
