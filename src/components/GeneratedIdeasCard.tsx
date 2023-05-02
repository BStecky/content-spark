import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/userProfileContext";
import { getIdeas, deleteIdea } from "../utils/contentUtils"; // Update the import path accordingly

interface Idea {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
}

const GeneratedIdeasCard: React.FC = () => {
  const { user } = useAuth();
  const { userProfile } = useUserProfile(user?.uid);
  const [generatedIdeas, setGeneratedIdeas] = useState<Idea[]>([]);
  const [ideaCopied, setIdeaCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0);
  const [ideaIdToDelete, setIdeaIdToDelete] = useState("");

  const fetchIdeas = async () => {
    if (user) {
      const ideas = await getIdeas(user.uid);
      setGeneratedIdeas(ideas);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [user]);

  const handleDeleteAttempt = (ideaId: string) => {
    setCurrentIdeaIndex(0);
    setShowModal(true);
    setIdeaIdToDelete(ideaId);
  };

  const handleDeleteConfirmation = async () => {
    await deleteIdea(ideaIdToDelete);
    setGeneratedIdeas(
      generatedIdeas.filter((idea) => idea.id !== ideaIdToDelete)
    );
    setShowModal(false);
  };

  const changeIdea = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentIdeaIndex((prevIndex) =>
        prevIndex < generatedIdeas.length - 1 ? prevIndex + 1 : 0
      );
    } else {
      setCurrentIdeaIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : generatedIdeas.length - 1
      );
    }
  };

  return (
    <div className="card bg-base-200 shadow-md border border-black w-[90%] h-[500px] mx-auto">
      <div className="card-body">
        <h2 className="card-title">
          Generated Ideas for {userProfile?.businessName}
        </h2>
        {generatedIdeas.length > 0 ? (
          <div className="flex justify-center">
            <button
              className="btn btn-circle btn-sm btn-primary z-10 my-auto mr-1"
              onClick={() => {
                changeIdea("prev");
                setIdeaCopied(false);
              }}
            >
              ◀
            </button>
            <div className="">
              {generatedIdeas.map((idea, index) => (
                <div
                  key={idea.id}
                  className={`text-center card w-full h-full bg-base-100 max-h-60 overflow-scroll ${
                    index === currentIdeaIndex ? "" : "hidden"
                  }`}
                >
                  <div className="card-body">
                    <p>{idea.content}</p>
                    <div className="flex flex-row p-6">
                      <button
                        className="btn btn-primary btn-sm m-2"
                        onClick={async () => {
                          navigator.clipboard.writeText(idea.content);
                          setIdeaCopied(true);
                          setTimeout(() => {
                            setIdeaCopied(false);
                          }, 2000);
                        }}
                      >
                        {ideaCopied ? "Idea Copied!" : "Copy"}
                      </button>
                      <button
                        className="btn btn-error btn-sm max-w-[150px] m-2"
                        onClick={() => handleDeleteAttempt(idea.id)}
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
                setIdeaCopied(false);
                changeIdea("next");
              }}
            >
              ▶
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              className="btn btn-circle btn-sm btn-primary z-10 my-auto mr-1"
              onClick={() => {
                changeIdea("prev");
                setIdeaCopied(false);
              }}
            >
              ◀
            </button>
            <div className="">
              <div className={`text-center card w-full bg-base-100`}>
                <div className="card-body">
                  <p>Your generated Ideas will display here!</p>
                  <div className="flex flex-row"></div>
                </div>
              </div>
            </div>
            <button
              className="btn btn-circle btn-sm btn-primary my-auto z-10 ml-1"
              onClick={() => {
                setIdeaCopied(false);
                changeIdea("next");
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
              <p>Are you sure you want to delete this idea?</p>
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

export default GeneratedIdeasCard;
