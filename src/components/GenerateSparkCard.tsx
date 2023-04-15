import React from "react";

const GenerateSparkCard: React.FC = () => {
  return (
    <div className="w-[100%] h-full card bg-base-300 mx-auto p-10 shadow-xl">
      <div className="card-body">
        <h2 className="text-2xl card-title font-bold text-center">
          Spark Ideas
        </h2>
        {/* <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
          <label htmlFor="platform" className="text-md">
            Platform:
          </label>
          <div className="flex flex-wrap justify-evenly p-4 max-w-md">
            {["Twitter", "LinkedIn"].map((platform) => (
              <div key={platform} className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text px-2">{platform}</span>
                  <input
                    type="radio"
                    name="radio-10"
                    className={`radio checked:bg-primary `}
                    value={platform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    checked={selectedPlatform === platform}
                  />
                </label>
              </div>
            ))}
          </div>

          <label htmlFor="tone" className="text-md">
            Choose a tone:
          </label>
          <div className="grid grid-cols-2 justify-evenly p-4 max-w-md">
            {[
              "Professional",
              "Friendly",
              "Casual",
              "Humorous",
              "Inspirational",
            ].map((tone) => (
              <div
                key={tone}
                className="form-control hover:outline outline-2 outline-primary m-1 rounded-md ease-in-out-[0.2s]"
              >
                <label className="label cursor-pointer">
                  <span className="label-text px-2">{tone}</span>
                  <input
                    type="radio"
                    name="radio-tone"
                    className={`radio checked:bg-primary`}
                    value={tone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    checked={selectedTone === tone}
                  />
                </label>
              </div>
            ))}
          </div>

          <label htmlFor="content-type" className="text-md">
            Content Type:
          </label>
          <div className="grid grid-cols-2 p-4 max-w-md">
            {renderContentTypeOptions(selectedPlatform)}
          </div>

          {contentType === "thread" && (
            <div className="w-full flex flex-col items-center">
              <label htmlFor="thread-length" className="text-md">
                Thread Length:
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (threadLength > 2) {
                      setThreadLength(threadLength - 1);
                    }
                  }}
                  className="btn btn-primary"
                >
                  -
                </button>
                <input
                  type=""
                  id="thread-length"
                  value={threadLength}
                  className="input input-bordered w-20 mx-2 text-center"
                  min="2"
                  max="10"
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 2 && value <= 10) {
                      setThreadLength(value);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (threadLength < 10) {
                      setThreadLength(threadLength + 1);
                    }
                  }}
                  className="btn btn-primary"
                >
                  +
                </button>
              </div>
            </div>
          )}
          {platformContentSelectedOptions[contentType]?.inputs.map((input) => (
            <div key={input.id} className="flex flex-col p-4">
              <label htmlFor={input.id} className="text-md">
                {input.label}
              </label>
              <textarea
                id={input.id}
                className="textarea textarea-bordered w-full"
                onChange={(e) => input.stateUpdater(e.target.value)}
                placeholder={input.placeholder}
              />
            </div>
          ))}
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary m-4"
          >
            Generate
          </button>
        </form> */}
      </div>
    </div>
  );
};

export default GenerateSparkCard;
