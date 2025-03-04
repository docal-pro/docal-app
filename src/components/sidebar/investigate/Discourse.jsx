import { useState, useEffect } from "react";
import { Dropdown } from "../../utils/Dropdown";
import { scamDiscourseClassifiers, callProxy } from "../../../utils/utils";
import { Search } from "lucide-react";

export const Discourse = () => {
  const [mode, setMode] = useState("Profile"); // 'Profile' or 'Post'
  const [input, setInput] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [forumUrl, setForumUrl] = useState("");

  const validateTwitterUsername = (username) =>
    /^[A-Za-z0-9_]{1,15}$/.test(username);
  const validateTweetLink = (link) =>
    /^https:\/\/(x|twitter)\.com\/[A-Za-z0-9_]{1,15}\/status\/\d+$/.test(link);
  const validateForumUrl = (url) => /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url);

  const handleSubmit = (e) => e.preventDefault();

  const handleSearch = async () => {
    setSearchAttempted(true);

    if (!validateForumUrl(forumUrl)) {
      setError("Please enter a valid forum URL");
      return;
    }

    if (mode === "Profile" && !validateTwitterUsername(input)) {
      setError("Please enter a valid username");
      return;
    }

    if (mode === "Post" && !validateTweetLink(input)) {
      setError("Please enter a valid post link");
      return;
    }

    setError("");
    setIsModalOpen(true);

    // TODO: Add the actual process
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setIsModalOpen(false);
    setSearchAttempted(false);
  };

  const toggleMode = () => {
    setMode(mode === "Profile" ? "Post" : "Profile");
    setInput("");
    setError("");
  };

  return (
    <div className="w-full">
      <div className="max-w-xl mx-auto mb-8">
        <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
          <div className="flex flex-col justify-center items-center my-4 gap-4">
            <div className="flex items-center space-x-3">
              <span
                className={`${
                  mode === "Post" ? "text-gray-600" : "text-green-600"
                } text-sm`}
              >
                <span className="relative group">
                  <span className="cursor-pointer">
                    <i className="fa-solid fa-user"></i>
                    <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-32 -translate-x-full lg:translate-x-0 -translate-y-full -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block">
                      {"Investigate User"}
                    </span>
                  </span>
                </span>{" "}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={mode === "Post"}
                  onChange={toggleMode}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-green-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-green-500 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-green-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
              </label>
              <span
                className={`${
                  mode === "Profile" ? "text-gray-600" : "text-green-600"
                } text-sm`}
              >
                {" "}
                <span className="relative group">
                  <span className="cursor-pointer">
                    <i className="fa-solid fa-font"></i>
                    <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-32 -translate-x-full lg:translate-x-0 -translate-y-full -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block">
                      {"Investigate Post"}
                    </span>
                  </span>
                </span>
              </span>
            </div>
          </div>

          <div className="text-md lg:text-lg font-bold w-full text-center mb-4 bg-gradient-to-br from-gray-300 to-gray-200 bg-clip-text text-transparent font-ocr tracking-tight text-gray-300 disabled:text-gray-500 disabled:bg-opacity-50 disabled:border-opacity-50 disabled:cursor-not-allowed">
            {mode === "Profile"
              ? "Enter Discourse forum URL & username below to index the individual"
              : "Enter a Discourse post link to investigate its content"}
          </div>

          {mode === "Profile" && (
            <div className="flex items-center">
              <input
                type="text"
                value={forumUrl}
                onChange={(e) => setForumUrl(e.target.value)}
                placeholder="Enter Discourse Forum URL"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 placeholder:text-gray-500 text-gray-300"
              />
              <span className="relative group ml-4">
                <span className="cursor-pointer text-xs lg:text-lg text-gray-500">
                  &#9432;
                  <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-72 -translate-x-full lg:translate-x-0 -translate-y-full -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block">
                    {`Enter the URL of the Discourse forum you want to investigate`}
                  </span>
                </span>
              </span>
            </div>
          )}

          <div className="relative flex items-center w-full">
            <div className="max-w-xl mx-auto w-full">
              <Dropdown
                selectedClasses={selectedClasses}
                setSelectedClasses={setSelectedClasses}
                options={scamDiscourseClassifiers}
                disabled={
                  (!forumUrl || !validateForumUrl(forumUrl)) &&
                  mode === "Profile"
                }
              />
            </div>
            <span className="relative group ml-4">
              <span className="cursor-pointer text-xs lg:text-lg text-gray-500">
                &#9432;
                <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-72 -translate-x-full lg:translate-x-0 -translate-y-full -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block">
                  {`This helps the AI with context about your input`}
                </span>
              </span>
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "Profile"
                  ? "Enter Discourse username"
                  : "Enter post link and press comma to add"
              }
              disabled={!selectedClasses || selectedClasses.length === 0}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-green-500 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={!selectedClasses || selectedClasses.length === 0}
              className={`px-6 py-3 ${
                mode === "Post" ? "bg-green-600" : "bg-green-600"
              } border ${
                mode === "Post" ? "border-green-600" : "border-green-600"
              } hover:bg-transparent rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Search className="w-6 h-6" />
            </button>
            <span className="relative group ml-4">
              <span className="cursor-pointer text-xs lg:text-lg text-gray-500">
                &#9432;
                <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-72 -translate-x-full lg:translate-x-0 -translate-y-full -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block">
                  {mode === "Profile"
                    ? "Enter the Discourse @username to investigate"
                    : "Enter post links for analysis"}
                </span>
              </span>
            </span>
          </div>
          {searchAttempted && error && (
            <p className="absolute -bottom-6 left-0 text-red-500 text-sm">
              {error}
            </p>
          )}
        </form>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl items-center justify-center flex flex-col">
            <img
              src="./assets/logo-light.png"
              width="100"
              className="transition-transform logo-rotate-fast items-center"
              alt="DOCAL Loader"
            />
            <p className="text-center mt-4 text-gray-300 font-ocr text-xl tracking-tight">
              Beep Boop
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
