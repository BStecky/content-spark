import React, { useEffect, useState } from "react";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { getUserProfile } from "@/utils/firebase";
import { useUserProfile } from "@/hooks/userProfileContext";
import { generateContent } from "../api/openai";
import { UserProfile } from "firebase/auth";
import UserCard from "@/components/UserCard";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const router = useRouter();
  const { userProfile } = useUserProfile(user?.uid);
  const hasProfile = userProfile !== null;

  const [selectedTone, setSelectedTone] = useState("Professional");
  const [contentType, setContentType] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [about, setAbout] = useState("");

  // ...

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
        // Display the generated text or handle it as needed
      } else {
        console.log("No content was generated.");
      }
    } catch (error: unknown) {
      console.error("Error generating content:", error);
    }
  };

  useEffect(() => {
    if (!loadingProfile && !hasProfile) {
      router.push("/getstarted");
    }
  }, [loadingProfile, hasProfile, router]);

  return (
    <PrivateRoute>
      <div className="h-screen">
        <Navbar />
        <div className="container mx-auto px-4">
          <h1 className="text-3xl text-primary font-bold text-center pt-10">
            Dashboard
          </h1>
          {user ? (
            <main>
              <section className="flex flex-col md:flex-row gap-4 justify-center items-start mt-10 text-accent">
                <UserCard />
                <div className="card glass bg-base-300 w-full md:w-auto">
                  <div className="card-body">
                    <h2 className="card-title">Target & Platforms</h2>
                    <p>Target Audience: {userProfile?.targetAudience}</p>
                    <p>Platforms: {userProfile?.platforms.join(", ")}</p>
                  </div>
                </div>
              </section>
              <section className="max-w-lg bg-base-300 mx-auto p-10 rounded-lg mt-10">
                <h2 className="text-2xl font-bold text-center">
                  Generate Content
                </h2>
                <div className="">
                  <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-sm mx-auto"
                  >
                    <div className="flex flex-col p-4">
                      <label htmlFor="tone" className="text-md">
                        Choose a tone:
                      </label>
                      <select
                        name="tone"
                        id="tone"
                        className="select select-bordered w-max"
                        value={selectedTone}
                        onChange={(e) => setSelectedTone(e.target.value)}
                      >
                        <option value="Professional">Professional</option>
                        <option value="Friendly">Friendly</option>
                        <option value="Casual">Casual</option>
                        <option value="Humorous">Humorous</option>
                        <option value="Inspirational">Inspirational</option>
                        {/* Add more options for other tones */}
                      </select>
                    </div>
                    <div className="flex flex-col p-4">
                      <label htmlFor="content-type" className="text-md">
                        Content Type
                      </label>
                      <select
                        id="content-type"
                        value={contentType}
                        className="select select-bordered w-max"
                        onChange={(e) => setContentType(e.target.value)}
                      >
                        <option value="">Select content type</option>
                        <option value="tweet">Tweet</option>
                        <option value="reply">Reply</option>
                        <option value="thread">Thread</option>
                      </select>
                    </div>
                    {contentType === "reply" && (
                      <div className="flex flex-col p-4">
                        <label htmlFor="reply-to" className="text-md">
                          Reply To
                        </label>
                        <textarea
                          id="reply-to"
                          value={replyTo}
                          className="textarea textarea-bordered w-full"
                          onChange={(e) => setReplyTo(e.target.value)}
                          placeholder="Enter the tweet to reply to"
                        />
                      </div>
                    )}
                    {contentType === "tweet" || contentType === "thread" ? (
                      <div className="flex flex-col p-4">
                        <label htmlFor="about" className="text-md">
                          About
                        </label>
                        <textarea
                          id="about"
                          value={about}
                          className="textarea textarea-bordered w-full"
                          onChange={(e) => setAbout(e.target.value)}
                          placeholder="Enter what the content should be about"
                        />
                      </div>
                    ) : null}
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="btn btn-primary m-4"
                    >
                      Generate
                    </button>
                  </form>
                </div>
              </section>
            </main>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </PrivateRoute>
  );
};
export default DashboardPage;
