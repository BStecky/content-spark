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
  const [tweetCopied, setTweetCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTweetIndex, setCurrentTweetIndex] = useState(0);
  const [tweetIdToDelete, setTweetIdToDelete] = useState("");

  const fetchTweets = async () => {
    if (user) {
      const tweets = await getTweets(user.uid);
      console.log("got tweets: ", tweets);
      setGeneratedTweets(tweets);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [user]);

  const handleDeleteAttempt = (tweetId: string) => {
    setCurrentTweetIndex(0);
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

  const changeTweet = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentTweetIndex((prevIndex) =>
        prevIndex < generatedTweets.length - 1 ? prevIndex + 1 : 0
      );
    } else {
      setCurrentTweetIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : generatedTweets.length - 1
      );
    }
  };

  return (
    <div className="card bg-base-300 w-[100%] shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          Generated Tweets for {userProfile?.businessName}
        </h2>
        {generatedTweets.length > 0 && (
          <div className="flex justify-center">
            <button
              className="btn btn-circle btn-sm btn-primary z-10 my-auto mr-1"
              onClick={() => {
                changeTweet("prev");
                setTweetCopied(false);
              }}
            >
              ◀
            </button>
            <div className="">
              {generatedTweets.map((tweet, index) => (
                <div
                  key={tweet.id}
                  className={`text-center card w-full bg-base-100 ${
                    index === currentTweetIndex ? "" : "hidden"
                  }`}
                >
                  <div className="card-body">
                    <p>{tweet.content}</p>
                    <div className="flex flex-row">
                      <button
                        className="btn btn-primary btn-sm m-2"
                        onClick={async () => {
                          navigator.clipboard.writeText(tweet.content);
                          setTweetCopied(true);
                          setTimeout(() => {
                            setTweetCopied(false);
                          }, 2000);
                        }}
                      >
                        {tweetCopied ? "Tweet Copied!" : "Copy"}
                      </button>
                      <button
                        className="btn btn-error btn-sm max-w-[150px] m-2"
                        onClick={() => handleDeleteAttempt(tweet.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn btn-circle btn-sm btn-primary my-auto z-10 ml-1"
              onClick={() => {
                setTweetCopied(false);
                changeTweet("next");
              }}
            >
              ▶
            </button>
          </div>
        )}
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
