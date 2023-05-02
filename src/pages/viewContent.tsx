import React from "react";
import MasonryGrid from "../components/MasonryGrid";
import { useState, useEffect } from "react";
import { getAllContent } from "../utils/contentUtils";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/userProfileContext";
import PrivateRoute from "@/components/auth/PrivateRoute";
import DashboardSidebar from "@/components/DashboardSidebar";

interface Content {
  id: string;
  userId: string;
  contentType: string;
  content: string;
  createdAt: Date;
}

const ContentView: React.FC = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.uid);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const userId = user?.uid;
          const allContent = await getAllContent(userId);
          setContent(allContent);
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching content:", err);
        }
      };

      fetchData();
    }
  }, [user]);

  return (
    <PrivateRoute>
      {user && userProfile ? (
        <div className="flex bg-base-300 min-h-screen">
          <DashboardSidebar user={user} userProfile={userProfile} />
          <div className="w-full ml-16 md:ml-48 lg:ml-64">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <button className="btn btn-ghost loading">Loading...</button>
              </div>
            ) : (
              <MasonryGrid content={content} />
            )}
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

export default ContentView;
