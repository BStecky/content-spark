import { SparklesIcon } from "@heroicons/react/24/solid";
import React from "react";
import { deleteContent } from "@/utils/contentUtils";

interface Content {
  id: string;
  userId: string;
  contentType: string;
  content: string;
  createdAt: Date;
}

interface ContentCardProps {
  content: Content;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content.content).then(
      () => {
        alert("Copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const handleEdit = () => {
    // Navigate to the editing page for the content
    alert("Edit functionality coming soon!");
  };

  const handleDelete = async () => {
    try {
      await deleteContent(content.id, content.contentType);
      alert("Content deleted!");
    } catch (error) {
      console.error("Error deleting content: ", error);
    }
  };

  const renderContentType = (contentType: string) => {
    switch (contentType) {
      case "twitterTweet":
        return (
          <div className="card-title">
            <img
              src="/images/twitter.png"
              alt="Twitter Icon"
              className="w-8 h-8 rounded-md"
            />
            <span>Tweet</span>
          </div>
        );
      case "twitterThread":
        return (
          <div className="card-title">
            <img
              src="/images/twitter.png"
              alt="Twitter Icon"
              className="w-8 h-8 rounded-md"
            />
            <span>Thread</span>
          </div>
        );
      case "twitterReply":
        return (
          <div className="card-title">
            <img
              src="/images/twitter.png"
              alt="Twitter Icon"
              className="w-8 h-8 rounded-md"
            />
            <span>Reply</span>
          </div>
        );
      case "contentIdeas":
        return (
          <div className="card-title">
            <div className="p-1 rounded-md bg-secondary">
              <SparklesIcon className="h-6 w-6 items-center" />
            </div>
            <span>Idea</span>
          </div>
        );
      default:
        return <span>{contentType}</span>;
    }
  };

  return (
    <div className="bg-base-100 card rounded-lg shadow-md m-2 border border-black">
      <div className="card-body">
        {renderContentType(content.contentType)}
        <p className="text-sm">{content.content}</p>
        <div className="card-actions">
          <button className="btn btn-sm btn-primary" onClick={handleCopy}>
            Copy
          </button>
          <button className="btn btn-sm btn-secondary" onClick={handleEdit}>
            Edit
          </button>
          <button className="btn btn-sm btn-error" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
