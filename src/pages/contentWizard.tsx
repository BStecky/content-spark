import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/userProfileContext";
import PrivateRoute from "@/components/auth/PrivateRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import { saveGeneratedContent } from "@/utils/contentUtils";
import {
  createTweetSuggestionPrompt,
  createPostSuggestionPrompt,
} from "@/utils/contentUtils";
import { CustomUserProfile } from "@/utils/firebase";
import { checkAndUpdateApiUsage } from "@/utils/planUtils";
import { generateGPT4Content } from "./api/openai";
import ContentWizardTweetsCard from "@/components/ContentWizardTweetsCard";
import ContentWizardPostsCard from "@/components/ContentWizardPostsCard";

const ContentWizard: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { userProfile } = useUserProfile(user?.uid);
  const hasProfile = userProfile !== null;
  const [generatedContent, setGeneratedContent] = useState("");
  const [progress, setProgress] = useState(0);
  const [topicKnown, setTopicKnown] = useState(false);
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState([
    "Motivation",
    "Success",
    "Productivity",
    "Creativity",
    "Innovation",
    "Leadership",
    "Solopreneur",
    "Strategy",
    "Sustainability",
  ]);
  const [customKeyword, setCustomKeyword] = useState("");
  const [tone, setTone] = useState("");
  const [contentType, setContentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestedTweets, setSuggestedTweets] = useState<string[]>([]);
  const [suggestedPosts, setSuggestedPosts] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [postTopic, setPostTopic] = useState("");
  const [postKeywords, setPostKeywords] = useState<string[]>([]);

  const handleCustomKeywordSubmit = () => {
    if (customKeyword.trim()) {
      setKeywords([...keywords, customKeyword]);
      setCustomKeyword("");
    }
  };
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

  const handleSave = () => {
    const contentCategory = "contentIdeas";
    if (user) {
      saveGeneratedContent(user?.uid, generatedContent, contentCategory);
    }
    alert("Your content has been saved!");
    setGeneratedContent("");
  };

  const getPostSuggestions: () => Promise<void> = async () => {
    // Prepare the OpenAI API parameters
    setLoadingSuggestions(true);
    moveForward();
    const prompt = createPostSuggestionPrompt(
      userProfile,
      contentType,
      postTopic,
      tone,
      keywords
    );

    const options = {
      message: prompt,
      context:
        "You are a professional content creator assistant, your goal is to create unique and relatable content ideas.",
      maxTokens: 450,
      n: 1,
      temperature: 0.7,
    };
    if (userProfile) {
      try {
        if ((await checkAndUpdateApiUsage(userProfile, 1)) == false) {
          console.log("Not enough API usage left.");
          return;
        }
        const response = await generateGPT4Content(options);
        if (response && response.length > 0) {
          setGeneratedContent(response);
          const posts = response.split("\n").map((line) => line.split(": ")[1]);
          setSuggestedPosts(posts.filter((post) => post && post.trim() !== ""));
          setLoadingSuggestions(false);
          setLoading(false);
        } else {
          console.log("No content was generated.");
        }
      } catch (error: unknown) {
        console.error("Error generating content:", error);
      }
    }
  };

  const getTweetSuggestions: () => Promise<void> = async () => {
    // Prepare the OpenAI API parameters
    setLoadingSuggestions(true);
    moveForward();
    const prompt = createTweetSuggestionPrompt(
      userProfile,
      contentType,
      topic,
      tone,
      keywords
    );
    const options = {
      message: prompt,
      context:
        "You are a professional content creator assistant here to help anyone grow their business or brand. You give out unique content ideas for all types of content.",
      maxTokens: 300,
      n: 1,
      temperature: 0.7,
    };
    if (userProfile) {
      try {
        if ((await checkAndUpdateApiUsage(userProfile, 1)) == false) {
          console.log("Not enough API usage left.");
          return;
        }
        const response = await generateGPT4Content(options);
        if (response && response.length > 0) {
          setGeneratedContent(response);
          const tweets = response
            .split("\n")
            .map((line) => line.split(": ")[1]);
          setSuggestedTweets(
            tweets.filter((tweet) => tweet && tweet.trim() !== "")
          );
          setLoadingSuggestions(false);
          setLoading(false);
        } else {
          console.log("No content was generated.");
        }
      } catch (error: unknown) {
        console.error("Error generating content:", error);
      }
    }
  };

  const handleRemoveTweet = (index: number) => {
    setSuggestedTweets((prevTweets) =>
      prevTweets.filter((_tweet, i) => i !== index)
    );
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

  const restartProgress = () => {
    setContentType("");
    setSelectedKeywords([]);
    setProgress(0);
    setTone("");
    setTopic("");
  };

  const renderContentStep = (userProfile: CustomUserProfile) => {
    switch (contentType) {
      case "tweet":
        return renderTweetStep();
      case "post":
        return renderPostStep();
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
              {/* <button
                className="btn btn-primary"
                onClick={() => setContentType("thread")}
              >
                Thread
              </button> */}
              <button
                className="btn btn-primary"
                onClick={() => setContentType("post")}
              >
                Post
              </button>
              {/* <button
                className="btn btn-primary"
                onClick={() => setContentType("video")}
              >
                Video
              </button> */}
              {/* <button
                className="btn btn-primary"
                onClick={() => setContentType("videoShort")}
              >
                Video Short
              </button> */}
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
              <h2 className="text-2xl">
                Select some keywords or input your own:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 justify-evenly p-4 max-w-lg mx-auto">
                {keywords.map((keyword) => (
                  <div
                    key={keyword}
                    className="form-control h-12 justify-center hover:outline outline-2 outline-primary bg-base-100 rounded-lg"
                  >
                    <label className="label cursor-pointer">
                      <span className="label-text px-2 text-xs lg:text-sm">
                        {keyword}
                      </span>
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
              <div className="max-w-lg mx-auto my-2 w-96">
                <label className="label">
                  <span className="label-text">Add your own keyword:</span>
                </label>
                <input
                  type="text"
                  className="input input-primary input-bordered w-full"
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleCustomKeywordSubmit()
                  }
                />
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleCustomKeywordSubmit}
                >
                  Add keyword
                </button>
              </div>
              <div className="flex gap-4 justify-between">
                <button className="btn btn-primary" onClick={moveBackward}>
                  Back
                </button>
                <button
                  className={`btn btn-primary ${
                    selectedKeywords.length === 0 && "btn-disabled"
                  }`}
                  onClick={moveForward}
                  disabled={selectedKeywords.length === 0}
                >
                  Next
                </button>
              </div>
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
              <button className="btn btn-primary" onClick={getTweetSuggestions}>
                Get my tweets
              </button>
            </div>
          </div>
        );
      case 3:
        return loadingSuggestions ? (
          <div className="flex justify-center items-center h-full">
            <button className="btn btn-ghost loading">
              {" "}
              Loading your suggestions...
            </button>
          </div>
        ) : (
          <section className="">
            <h1 className="font-bold text-3xl text-center p-2">
              Your Tweet Suggestions!
            </h1>
            <div className="flex flex-wrap justify-center">
              {userProfile &&
                suggestedTweets.map((tweet, index) => (
                  <ContentWizardTweetsCard
                    key={index}
                    user={user}
                    userProfile={userProfile}
                    tweet={tweet}
                    onRemove={() => handleRemoveTweet(index)}
                  />
                ))}
            </div>
            <div className="text-center m-4">
              <button className="btn btn-primary" onClick={restartProgress}>
                Go again
              </button>
            </div>
          </section>
        );
      default:
        return <div>Something went wrong!</div>;
    }
  };

  const renderPostStep = () => {
    switch (progress) {
      case 0:
        return (
          <div className="">
            <div className="p-4 flex flex-col gap-2 items-center text-center">
              <h2 className=" font-bold text-3xl">
                Do you know what you want your post to be about?
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
                Write what you want your post to be about.
              </h2>
              <textarea
                className="textarea textarea-accent m-4 h-32"
                placeholder="Give as much or as little detail as you want."
                value={postTopic}
                onChange={(e) => setPostTopic(e.target.value)}
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
              <h2 className="text-2xl">
                Select some keywords or input your own:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 justify-evenly p-4 max-w-lg mx-auto">
                {keywords.map((keyword) => (
                  <div
                    key={keyword}
                    className="form-control h-12 justify-center hover:outline outline-2 outline-primary bg-base-100 rounded-lg"
                  >
                    <label className="label cursor-pointer">
                      <span className="label-text px-2 text-xs lg:text-sm">
                        {keyword}
                      </span>
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
              <div className="max-w-lg mx-auto my-2 w-96">
                <label className="label">
                  <span className="label-text">Add your own keyword:</span>
                </label>
                <input
                  type="text"
                  className="input input-primary input-bordered w-full"
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleCustomKeywordSubmit()
                  }
                />
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleCustomKeywordSubmit}
                >
                  Add keyword
                </button>
              </div>
              <div className="flex gap-4 justify-between">
                <button className="btn btn-primary" onClick={moveBackward}>
                  Back
                </button>
                <button
                  className={`btn btn-primary ${
                    selectedKeywords.length === 0 && "btn-disabled"
                  }`}
                  onClick={moveForward}
                  disabled={selectedKeywords.length === 0}
                >
                  Next
                </button>
              </div>
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
              <button className="btn btn-primary" onClick={getPostSuggestions}>
                Get my post ideas
              </button>
            </div>
          </div>
        );
      case 3:
        return loadingSuggestions ? (
          <div className="flex justify-center items-center h-full">
            <button className="btn btn-ghost loading">
              Loading your suggestions...
            </button>
          </div>
        ) : (
          <section className="">
            <h1 className="font-bold text-3xl text-center p-2">
              Your Post Suggestions!
            </h1>
            <div className="flex flex-wrap justify-center">
              {userProfile &&
                suggestedPosts.map((post, index) => (
                  <ContentWizardPostsCard
                    key={index}
                    user={user}
                    userProfile={userProfile}
                    post={post}
                    onRemove={() => handleRemoveTweet(index)}
                  />
                ))}
            </div>
            <div className="text-center m-4 p-2">
              <button className="btn btn-primary" onClick={restartProgress}>
                Go again
              </button>
            </div>
          </section>
        );
      default:
        return <div>Something went wrong!</div>;
    }
  };

  return (
    <PrivateRoute>
      {user && userProfile ? (
        <div className="min-h-screen flex bg-base-200 overflow-auto">
          <DashboardSidebar user={user} userProfile={userProfile} />
          <div className="w-full flex flex-row p-2 lg:py-6 lg:max-h-screen ml-16 md:ml-48 lg:ml-64">
            <main
              className={`w-full px-2 flex flex-col lg:flex-row mt-2 lg:gap-4 justify-center ${
                progress !== 3 ? "items-center" : ""
              }`}
            >
              {renderContentStep(userProfile)}
            </main>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <button className="btn btn-ghost loading">Loading...</button>
        </div>
      )}
    </PrivateRoute>
  );
};

export default ContentWizard;
