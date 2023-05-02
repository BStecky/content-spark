import React from "react";

const SuggestedContentCard: React.FC = () => {
  return (
    <div className="m-auto card bg-base-200 h-full items-center text-center justify-center w-96 shadow-md border border-black">
      <div className="p-10 items-center text-center">
        <h1 className="card-title">Suggested Content</h1>
        <p className="text-lg">Coming soon...</p>
      </div>
    </div>
  );
};

export default SuggestedContentCard;
