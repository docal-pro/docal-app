import { useState, useEffect } from "react";
import { getTweetIdFromLink } from "../../utils/utils";

export const Input = ({ isOpen, onClose, onSubmit, maxTweets = 5 }) => {
  const [input, setInput] = useState("");
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState("");

  const validateTweetLink = (link) =>
    /^https:\/\/(x|twitter)\.com\/[A-Za-z0-9_]{1,15}\/status\/\d+$/.test(link);

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Check if input ends with comma
    if (value.endsWith(",")) {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // If there's text in input, try to add it first
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

    onSubmit(tweets);
    setTweets([]);
    setInput("");
  };

  const handleCancel = () => {
    setTweets([]);
    setInput("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md lg:max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h2 className="text-xl font-ocr text-gray-300 tracking-tight">
                Enter Tweet Links
              </h2>
              <h3 className="text-sm font-sfmono text-gray-500">
                • maximum {maxTweets} tweets
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 text-xl"
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter tweet link and press comma to add"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
            />
            <div className="absolute right-0 -top-2 -translate-y-full text-gray-500 text-sm">
              ({tweets.length}/{maxTweets})
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {tweets.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 -mt-4">
              {tweets.map((tweet, index) => (
                <div
                  key={index}
                  className="max-w-1/5 bg-gray-800 text-accent-steel px-2 py-[4px] md:px-3 md:py-1 rounded-md flex items-center gap-1"
                >
                  <span className="text-xs lg:text-sm w-full mr-2">
                    {getTweetIdFromLink(tweet)}
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

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 font-ocr tracking-tight text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent-steel bg-opacity-30 rounded-md hover:bg-opacity-50 transition-all text-blue-300 hover:text-blue-100 tracking-tight font-ocr text-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
