import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/userProfileContext";
import { getTweets, deleteTweet } from "../utils/contentUtils"; // Update the import path accordingly

interface Tweet {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
}

const GeneratedTweetsCard: React.FC = () => {
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.uid);
  const [generatedTweets, setGeneratedTweets] = useState<Tweet[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [tweetIdToDelete, setTweetIdToDelete] = useState("");

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const tweets = await getTweets(user.uid);
        console.log("got tweets: ", tweets);
        setGeneratedTweets(tweets);
      };
      fetchData();
    }
  }, [user]);

  const handleDeleteAttempt = (tweetId: string) => {
    setShowModal(true);
    setTweetIdToDelete(tweetId);
  };

  const handleDeleteConfirmation = async () => {
    await deleteTweet(tweetIdToDelete);
    setGeneratedTweets(
      generatedTweets.filter((tweet) => tweet.id !== tweetIdToDelete)
    );
    setShowModal(false);
  };

  return (
    <div className="card bg-base-300 w-[100%] shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          Generated Tweets for {userProfile?.businessName}
        </h2>
        {generatedTweets.map((tweet) => (
          <div className="card bg-base-100 p-4 shadow-sm">
            <div key={tweet.id} className="tweet">
              <p>{tweet.content}</p>
              <button
                className="btn btn-error"
                onClick={() => handleDeleteAttempt(tweet.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this tweet?</p>
              <div className="modal-action">
                <button className="btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={handleDeleteConfirmation}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedTweetsCard;
