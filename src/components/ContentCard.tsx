import React from "react";

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
  return (
    <div className="bg-base-100 rounded-lg shadow-md p-4 m-2">
      <h2 className="text-xl mb-2">{content.contentType}</h2>
      <p className="text-sm">{content.content}</p>

      {/* Add buttons for edit, delete, and share actions */}
    </div>
  );
};

export default ContentCard;
