import { useState, useEffect } from "react";
import { Dropdown } from "../../utils/Dropdown";
import {
  scamTwitterClassifiers,
  callProxy,
  getTweetIdFromLink,
  getAction,
} from "../../../utils/utils";
import { Search } from "lucide-react";

export const Twitter = () => {
  const [mode, setMode] = useState("Tweeter"); // 'Tweeter' or 'Tweet'
  const [input, setInput] = useState("");
  const [tweets, setTweets] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(false);
  const maxTweets = 5;

  const validateTwitterUsername = (username) =>
    /^[A-Za-z0-9_]{1,15}$/.test(username);

  const validateTweetLink = (link) =>
    /^https:\/\/(x|twitter)\.com\/[A-Za-z0-9_]{1,15}\/status\/\d+$/.test(link);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (mode === "Tweet" && value.endsWith(",")) {
      const tweetLink = value.slice(0, -1).trim();

      if (tweets.length >= maxTweets) {
        setError(`Maximum ${maxTweets} tweets allowed`);
        setInput(value.slice(0, -1));
        return;
      }

      if (validateTweetLink(tweetLink)) {
        if (!tweets.includes(tweetLink)) {
          setTweets([...tweets, tweetLink]);
          setInput("");
          setError("");
        } else {
          setError("Tweet already added");
          setInput("");
        }
      } else {
        setError("Please enter a valid tweet link");
        setInput(value.slice(0, -1));
      }
    } else {
      setInput(value);
    }
  };

  const removeTweet = (tweetToRemove) => {
    setTweets(tweets.filter((tweet) => tweet !== tweetToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearchAttempted(true);

    if (mode === "Tweeter") {
      if (!validateTwitterUsername(input)) {
        setError("Please enter a valid username");
        return;
      }
    } else {
      if (input.trim()) {
        if (validateTweetLink(input.trim())) {
          if (!tweets.includes(input.trim())) {
            setTweets([...tweets, input.trim()]);
            setInput("");
          }
        } else {
          setError("Please enter a valid tweet link");
          return;
        }
      }

      if (tweets.length === 0) {
        setError("Please enter at least one tweet");
        return;
      }
    }

    setError("");
    setIsModalOpen(true);
  };

  const handleSearch = async () => {
    setSearchAttempted(true);

    const tweetIds = [];
    if (mode === "Tweeter") {
      if (!validateTwitterUsername(input)) {
        setError("Please enter a valid Twitter username");
        return;
      }
    } else if (mode === "Tweet") {
      for (const tweet of tweets) {
        const tweetId = getTweetIdFromLink(tweet);
        if (tweetId) {
          tweetIds.push(tweetId);
        }
      }
    }

    setError("");
    setIsModalOpen(true);

    // Post request to process
    try {
      const process = {
        func: mode === "Tweeter" ? getAction("index") : getAction("scrape"),
        user: mode === "Tweeter" ? input : null,
        data: mode === "Tweeter" ? input : tweetIds.join(","),
      };
      const result = await callProxy("process", "POST", process);
      console.log(result);
    } catch (error) {
      console.error("❌ Error:", error);
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
    setIsModalOpen(false);
    setSearchAttempted(false);
  };

  const toggleMode = () => {
    setMode(mode === "Tweeter" ? "Tweet" : "Tweeter");
    setInput("");
    setError("");
  };

  return (
    <div className="w-full lg:mt-12 md:mt-12">
      <div className="flex flex-col justify-center items-center my-4 gap-4">
        <div className="flex items-center space-x-3">
          <span
            className={`${
              mode === "Tweet" ? "text-gray-600" : "text-blue-600"
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
              checked={mode === "Tweet"}
              onChange={toggleMode}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-blue-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-blue-500 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-blue-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <span
            className={`${
              mode === "Tweeter" ? "text-gray-600" : "text-blue-600"
            } text-sm`}
          >
            {" "}
            <span className="relative group">
              <span className="cursor-pointer">
                <i className="fa-solid fa-font"></i>
                <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-32 -translate-x-full lg:translate-x-0 -translate-y-full -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block">
                  {"Investigate Tweet"}
                </span>
              </span>
            </span>
          </span>
        </div>
      </div>

      <div className="text-md lg:text-lg font-bold w-full text-center mb-4 bg-gradient-to-br from-gray-300 to-gray-200 bg-clip-text text-transparent font-ocr tracking-tight">
        {mode === "Tweeter"
          ? "Enter Twitter/X username below to index the individual"
          : "Enter a tweet link to investigate its content"}
      </div>

      <div className="max-w-xl mx-auto h-auto lg:mt-1 mb-16">
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col gap-4 ml-8"
        >
          <div className="relative flex items-center w-full">
            <div className="max-w-xl mx-auto w-full">
              <Dropdown
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                options={scamTwitterClassifiers}
                disabled={false}
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
              onChange={handleInputChange}
              placeholder={
                mode === "Tweeter"
                  ? "Enter Twitter/X @"
                  : "Enter tweet link & press comma to add"
              }
              disabled={!selectedClass}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={!selectedClass}
              className={`px-6 py-3 ${
                mode === "Tweet" ? "bg-blue-600" : "bg-blue-600"
              } border ${
                mode === "Tweet" ? "border-blue-600" : "border-blue-600"
              } hover:bg-transparent rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Search className="w-6 h-6" />
            </button>
            <span className="relative group ml-4">
              <span className="cursor-pointer text-xs lg:text-lg text-gray-500">
                &#9432;
                <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-72 -translate-x-full lg:translate-x-0 -translate-y-full -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block">
                  {mode === "Tweeter"
                    ? "Enter the Twitter/X username to investigate"
                    : "Enter a tweet link for analysis"}
                </span>
              </span>
            </span>
          </div>

          {searchAttempted && error && (
            <p className="absolute -bottom-6 left-0 text-red-500 text-sm">
              {error}
            </p>
          )}

          {/* Tweets display section */}
          {mode === "Tweet" && tweets.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tweets.map((tweet, index) => (
                <div
                  key={index}
                  className="bg-gray-800 text-accent-steel px-3 py-1 rounded-md flex items-center gap-2 text-sm"
                >
                  <span className="max-w-[200px]">
                    {tweet.slice(0, 20)}
                    <span className="tracking-word">...</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTweet(tweet)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
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
