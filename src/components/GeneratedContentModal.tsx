import React, { useState } from "react";
import { saveGeneratedContent } from "@/utils/contentUtils";

interface GeneratedContentModalProps {
  showModal: boolean;
  onClose: () => void;
  content: string;
  userId: string;
  selectedPlatform: string;
  contentType: string;
}

const GeneratedContentModal: React.FC<GeneratedContentModalProps> = ({
  showModal,
  onClose,
  content,
  userId,
  selectedPlatform,
  contentType,
}) => {
  const [editedContent, setEditedContent] = useState(content);
  const modalId = "generated-content-modal";

  if (!showModal) {
    return null;
  }

  const handleSave = () => {
    const contentCategory = selectedPlatform.toLowerCase().concat(contentType);
    saveGeneratedContent(userId, editedContent, contentCategory);
    onClose();
  };

  const handleDelete = () => {
    onClose();
  };

  return (
    <>
      <input
        type="checkbox"
        id={modalId}
        className="modal-toggle"
        checked={showModal}
        readOnly
      />
      <div className="modal">
        <div className="modal-box">
          <h2 className="text-2xl font-bold mb-4">Generated Content</h2>
          <textarea
            className="textarea textarea-bordered w-full mb-4"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{ height: "175px" }}
          />
          <div className="modal-action">
            <button onClick={handleDelete} className="btn btn-error mx-2">
              Delete
            </button>
            <button onClick={handleSave} className="btn btn-primary mx-2">
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneratedContentModal;
