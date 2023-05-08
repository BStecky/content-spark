import { CustomUserProfile } from "@/utils/firebase";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";

const SuggestedContentCard: React.FC<{
  user: User | null;
  userProfile: CustomUserProfile;
}> = ({ user, userProfile }) => {
  const [trendingTopics, setTrendingTopics] = useState<Array<string>>([]);
  const googleTrends = require("google-trends-api");
  const businessDescription = userProfile.businessDescription;

  // useEffect(() => {
  //   const fetchTrendingTopics = async () => {
  //     try {
  //       const response = await fetch(
  //         `./api/trendingTopics?businessDescription=${encodeURIComponent(
  //           "handmade candles"
  //         )}`
  //       );
  //       if (response.ok) {
  //         const data = await response.json();
  //         setTrendingTopics(data);
  //       } else {
  //         console.error(
  //           "Error fetching trending topics: status",
  //           response.status
  //         );
  //         console.error("Error message:", await response.text());
  //       }
  //     } catch (error) {
  //       console.error("Error fetching trending topics:", error);
  //     }
  //   };

  //   if (businessDescription) {
  //     fetchTrendingTopics();
  //   }
  // }, [businessDescription]);

  return (
    <div className="m-auto card bg-base-200 h-full items-center text-center justify-center w-96 shadow-md border border-black">
      <div className="p-10 items-center text-center">
        <h1 className="card-title">Trending Topics</h1>
        {trendingTopics.length > 0 ? (
          <ul className="list-disc ml-5 text-left">
            {trendingTopics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        ) : (
          <p className="text-lg">Fetching trending topics...</p>
        )}
      </div>
    </div>
  );
};

export default SuggestedContentCard;
