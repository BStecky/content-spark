import React, { useState } from "react";
import { saveGeneratedContent } from "@/utils/contentUtils";
import { User } from "firebase/auth";
import { CustomUserProfile } from "@/utils/firebase";
import { SparklesIcon } from "@heroicons/react/24/solid";

interface ContentWizardPostsCardProps {
  user: User | null;
  userProfile: CustomUserProfile;
  post: string;
  onRemove: () => void;
}

const ContentWizardPostsCard: React.FC<ContentWizardPostsCardProps> = ({
  post,
  user,
  onRemove,
}) => {
  const [editedPost, setEditedPost] = useState(post);
  const handleSave = () => {
    let contentCategory = "contentIdeas";
    if (user) {
      saveGeneratedContent(user?.uid, editedPost, contentCategory);
    }
    alert("Your content has been saved!");
  };

  const handleDelete = () => {
    alert("Your content has been deleted!");
    onRemove();
  };

  return (
    <div className="bg-base-100 card rounded-lg shadow-md m-2 border border-black w-[450px]">
      <div className="card-body">
        <div className="card-title">
          <SparklesIcon className="h-8 w-8 items-center" />
          <span>Post</span>
        </div>
        <textarea
          className="textarea textarea-bordered w-full mb-4"
          value={post}
          onChange={(e) => setEditedPost(e.target.value)}
          style={{ height: "300px" }}
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

export default ContentWizardPostsCard;
