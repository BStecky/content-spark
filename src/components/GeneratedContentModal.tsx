import React, { useState } from "react";

// TODO: get this working then clean up get started and signup
interface GeneratedContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onSave: (content: string) => void;
  onDelete: () => void;
}

const GeneratedContentModal: React.FC<GeneratedContentModalProps> = ({
  isOpen,
  onClose,
  content,
  onSave,
  onDelete,
}) => {
  const [editedContent, setEditedContent] = useState(content);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(editedContent);
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="w-full max-w-md p-6 mx-auto bg-base-300 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Generated Content</h2>
        <textarea
          className="textarea textarea-bordered w-full mb-4"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
        <div className="flex justify-end">
          <button onClick={handleDelete} className="btn btn-error mx-2">
            Delete
          </button>
          <button onClick={handleSave} className="btn btn-primary mx-2">
            Save
          </button>
        </div>
      </div>
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
    </div>
  );
};

export default GeneratedContentModal;
