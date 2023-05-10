import React, { useState } from "react";
import { saveGeneratedContent } from "@/utils/contentUtils";
import { User } from "firebase/auth";
import { CustomUserProfile } from "@/utils/firebase";

interface ContentWizardTweetsCardProps {
  user: User | null;
  userProfile: CustomUserProfile;
  tweet: string;
  onRemove: () => void;
}

const ContentWizardTweetsCard: React.FC<ContentWizardTweetsCardProps> = ({
  tweet,
  user,
  onRemove,
}) => {
  const [editedTweet, setEditedTweet] = useState(tweet);
  const handleSave = () => {
    let contentCategory = "twitterTweets";
    if (user) {
      saveGeneratedContent(user?.uid, editedTweet, contentCategory);
    }
    alert("Your content has been saved!");
  };

  const handleDelete = () => {
    alert("Your content has been deleted!");
    onRemove();
  };

  return (
    <div className="bg-base-100 card rounded-lg shadow-md m-2 border border-black w-96">
      <div className="card-body">
        <div className="card-title">
          <img
            src="/images/twitter.png"
            alt="Twitter Icon"
            className="w-8 h-8 rounded-md"
          />
          <span>Tweet</span>
        </div>
        <textarea
          className="textarea textarea-bordered w-full mb-4"
          value={tweet}
          onChange={(e) => setEditedTweet(e.target.value)}
          style={{ height: "200px" }}
        />
        <div className="card-actions">
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-sm btn-error" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentWizardTweetsCard;
