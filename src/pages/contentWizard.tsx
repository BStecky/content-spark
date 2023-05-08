import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/userProfileContext";
import PrivateRoute from "@/components/auth/PrivateRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import { saveGeneratedContent } from "@/utils/contentUtils";

const ContentWizard: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { userProfile } = useUserProfile(user?.uid);
  const hasProfile = userProfile !== null;
  const [generatedContent, setGeneratedContent] = useState("");
  const [progress, setProgress] = useState(0);
  const [topicKnown, setTopicKnown] = useState(false);
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [tone, setTone] = useState("");
  const [contentType, setContentType] = useState("");

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

  const moveForward = () => {
    setProgress(progress + 1);
  };

  const moveBackward = () => {
    setProgress(progress - 1);
  };

  const renderContentStep = () => {
    switch (contentType) {
      case "tweet":
        return renderTweetStep();
      // Add other cases for different content types here
      default:
        return (
          <section className="mx-auto flex flex-col items-center text-center">
            <div className="">
              <h1 className="text-3xl font-bold">
                The <span className="text-primary">Content Wizard</span> will
                guide you through the content creation process.
              </h1>
              <h2 className="text-xl p-2">Lets get started.</h2>
              <h2 className="text-2xl">
                What kind of content do you want to create?
              </h2>
            </div>
            <div className="flex flex-row flex-wrap gap-2 pt-6">
              <button
                className="btn btn-primary"
                onClick={() => setContentType("tweet")}
              >
                Tweet
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setContentType("thread")}
              >
                Thread
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setContentType("post")}
              >
                Post
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setContentType("video")}
              >
                Video
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setContentType("videoShort")}
              >
                Video Short
              </button>
            </div>
          </section>
        );
    }
  };

  const renderTweetStep = () => {
    switch (progress) {
      case 0:
        return (
          <div className="">
            <div className="p-4 flex flex-col gap-2 items-center text-center">
              <h2 className=" font-bold text-3xl">
                Do you know what you want to tweet about?
              </h2>
              <div className="flex flex-col gap-4 w-[50%] pt-6">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setTopicKnown(true);
                    moveForward();
                  }}
                >
                  Yes
                </button>
                <button
                  className="btn btn-accent"
                  onClick={() => {
                    setTopicKnown(false);
                    moveForward();
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        );
      case 1:
        if (topicKnown) {
          return (
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold">
                Write what you want your tweet to be about.
              </h2>
              <textarea
                className="textarea textarea-accent m-4 h-32"
                placeholder="Give as much or as little detail as you want."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              ></textarea>
              <div className="flex gap-4 justify-between">
                <button className="btn btn-primary" onClick={moveBackward}>
                  Back
                </button>
                <button className="btn btn-primary" onClick={moveForward}>
                  Next
                </button>
              </div>
            </div>
          );
        } else {
          return (
            <div>
              <p>Select some keywords or input your own:</p>
              {/* Render a list of keywords here, allowing users to select or input their own */}
              <button onClick={moveForward}>Next</button>
              <button onClick={moveBackward}>Back</button>
            </div>
          );
        }
      case 2:
        return (
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">
              What kind of vibe are you going for?
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 justify-evenly p-4 max-w-lg mx-auto">
              {[
                "Professional",
                "Friendly",
                "Casual",
                "Humorous",
                "Inspirational",
                "Witty",
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
                      onChange={(e) => setTone(e.target.value)}
                      checked={tone === tone}
                    />
                  </label>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 justify-between">
              <button className="btn btn-primary" onClick={moveBackward}>
                Back
              </button>
              <button className="btn btn-primary" onClick={moveForward}>
                Get my tweets
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            {/* Display generated tweets here */}
            <button onClick={handleSave}>Save</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={moveBackward}>Back</button>
          </div>
        );
      default:
        return <div>Something went wrong!</div>;
    }
  };

  return (
    <PrivateRoute>
      {user && userProfile ? (
        <div className="min-h-screen flex bg-base-300">
          <DashboardSidebar user={user} userProfile={userProfile} />
          <div className="w-full flex flex-row p-2 lg:py-6 lg:max-h-screen ml-16 md:ml-48 lg:ml-64">
            <main className="w-full px-2 flex flex-col lg:flex-row mt-2 lg:gap-4 justify-center items-center">
              {renderContentStep()}
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

export default ContentWizard;
