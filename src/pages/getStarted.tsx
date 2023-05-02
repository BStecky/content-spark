import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../utils/firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { firestore } from "../utils/firebase";
import PrivateRoute from "@/components/auth/PrivateRoute";
import Navbar from "@/components/Navbar";
import { useUserProfile } from "../hooks/userProfileContext";

const GetStarted: React.FC = () => {
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [platforms, setPlatforms] = useState<Array<string>>([]);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const router = useRouter();
  const { updateUserProfile } = useUserProfile(auth.currentUser?.uid);
  const userId = auth.currentUser?.uid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userId) {
        await setDoc(doc(collection(firestore, "users"), userId), {
          userType,
          businessName,
          businessDescription,
          targetAudience,
          platforms,
          planId: "free", // Set the default planId here
          apiCallUsage: 0, // Initialize apiCallUsage
          lastApiCallReset: new Date(), // Initialize lastApiCallReset with the current date
        });
        setError("");
        await updateUserProfile();
        router.push("/dashboard");
      } else {
        setError("User not found");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const checkFormComplete = () => {
      return (
        userType.trim() !== "" &&
        businessName.trim() !== "" &&
        businessDescription.trim() !== "" &&
        targetAudience.trim() !== "" &&
        platforms.length > 0
      );
    };

    setIsFormComplete(checkFormComplete());
  }, [userType, businessName, businessDescription, targetAudience, platforms]);

  const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const platform = e.target.value;
    if (e.target.checked) {
      setPlatforms((prevPlatforms) => [...prevPlatforms, platform]);
    } else {
      setPlatforms((prevPlatforms) =>
        prevPlatforms.filter((p) => p !== platform)
      );
    }
  };

  return (
    <main className="min-h-screen lg:min-h-screen pb-10">
      <PrivateRoute>
        <Navbar></Navbar>
        <section className="w-[70%] bg-base-200 mx-auto p-10 rounded-lg mt-10 shadow-md border border-black">
          <h2 className="text-center text-2xl font-bold mb-4">Get Started</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="w-[50%] mx-auto">
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="userType">
                Are you a small business owner, content creator, or solo
                entrepreneur?
              </label>
              <select
                className="input input-bordered input-primary w-full max-w-s"
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="">Select what you identify with most</option>
                <option value="Small Business Owner">
                  Small Business Owner
                </option>
                <option value="Content Creator">Content Creator</option>
                <option value="Solo Entrepreneur">Solo Entrepreneur</option>
              </select>
            </div>
            {/* Add more questions as needed */}
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="businessName">
                What is your business name, product name, or content creator
                name?
              </label>
              <input
                className="input input-bordered input-primary w-full max-w-s"
                id="businessName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block font-bold mb-2"
                htmlFor="businessDescription"
              >
                Please provide a brief description of your business, product, or
                content. 2-3 sentences or more.
              </label>
              <div className="pb-2">
                <p className="opacity-50 underline">Examples</p>
                <ul className="opacity-50 list-disc ml-10 text-s">
                  <li>Competitive League of Legends streamer</li>
                  <li>Local gardening and lawncare</li>
                  <li>
                    Handmade crafts and collectibles seller and content creator
                  </li>
                </ul>
              </div>
              <textarea
                className="input input-bordered input-primary p-4 w-full max-w-s h-36"
                id="businessDescription"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="targetAudience">
                What is your target audience or ideal customer?
              </label>
              <div className="pb-2">
                <p className="opacity-50 underline">Examples</p>
                <ul className="opacity-50 list-disc ml-10">
                  <li>All ages who use computers</li>
                  <li>Young adults interested in twitter</li>
                  <li>Anybody who likes candles</li>
                </ul>
              </div>
              <input
                className="input input-bordered input-primary w-full max-w-s"
                id="targetAudience"
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="platforms">
                What Social Media platforms do you use or plan on using?
              </label>
              <div className="grid grid-cols-2">
                <div className="flex items-center">
                  <input
                    className="checkbox checkbox-primary"
                    id="platform-twitter"
                    type="checkbox"
                    value="Twitter"
                    onChange={handlePlatformChange}
                  />
                  <label htmlFor="platform-twitter" className="p-2">
                    Twitter
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    className="checkbox checkbox-primary"
                    id="platform-facebook"
                    type="checkbox"
                    value="Facebook"
                    onChange={handlePlatformChange}
                  />
                  <label htmlFor="platform-facebook" className="p-2">
                    Facebook
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    className="checkbox checkbox-primary"
                    id="platform-youtube"
                    type="checkbox"
                    value="Youtube"
                    onChange={handlePlatformChange}
                  />
                  <label htmlFor="platform-youtube" className="p-2">
                    Youtube
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    className="checkbox checkbox-primary"
                    id="platform-instagram"
                    type="checkbox"
                    value="Instagram"
                    onChange={handlePlatformChange}
                  />
                  <label htmlFor="platform-instagram" className="p-2">
                    Instagram
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    className="checkbox checkbox-primary"
                    id="platform-linkedin"
                    type="checkbox"
                    value="LinkedIn"
                    onChange={handlePlatformChange}
                  />
                  <label htmlFor="platform-linkedin" className="p-2">
                    LinkedIn
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    className="checkbox checkbox-primary"
                    id="platform-twitch"
                    type="checkbox"
                    value="Twitch"
                    onChange={handlePlatformChange}
                  />
                  <label htmlFor="platform-twitch" className="p-2">
                    Twitch
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    className="checkbox checkbox-primary"
                    id="platform-pinterest"
                    type="checkbox"
                    value="Pinterest"
                    onChange={handlePlatformChange}
                  />
                  <label htmlFor="platform-pinterest" className="p-2">
                    Pinterest
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!isFormComplete}
              >
                {isFormComplete
                  ? "Save and Continue"
                  : "Please fill out all fields"}
              </button>
            </div>
          </form>
        </section>
      </PrivateRoute>
    </main>
  );
};

export default GetStarted;
