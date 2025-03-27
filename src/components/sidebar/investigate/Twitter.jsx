import { useState, useEffect } from "react";
import { Dropdown } from "../../utils/Dropdown";
import {
  scamTwitterClassifiers,
  getTweetIdFromLink,
  getAction,
  toast,
  toastContainerConfig,
} from "../../../utils/utils";
import { callProxy } from "../../../utils/api";
import { Search } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWallet } from "@solana/wallet-adapter-react";

export const Twitter = () => {
  const { wallet } = useWallet();
  const [mode, setMode] = useState("Tweeter"); // Mode'Tweeter' or 'Tweet'
  const [input, setInput] = useState("");
  const [caller, setCaller] = useState("");
  const [transaction, setTransaction] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
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

  const handleSearch = async () => {
    setSearchAttempted(true);

    if (!wallet) {
      toast.error("Please connect your wallet");
      return;
    }

    const caller = wallet.adapter.publicKey.toString();
    if (!caller) {
      toast.error("Please connect your wallet");
      return;
    }
    const message = `Requesting signature to index with account ${caller}`;
    const signatureUint8Array = await wallet.adapter.signMessage(
      new TextEncoder().encode(message)
    );
    const signature = btoa(String.fromCharCode(...signatureUint8Array));
    setCaller(caller);
    setTransaction(signature);

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
        data: mode === "Tweeter" ? [] : tweetIds.join(","),
        ctxs: selectedClasses.join(","),
        caller,
        transaction,
      };
      const { status, result } = await callProxy(
        "twitter/process",
        "POST",
        process
      );
      if (status === 200) {
        if (result.result.includes("Tweets already exist")) {
          toast.info("Tweets already indexed in database");
        } else if (
          result.result.includes("No tweets found") &&
          !result.result.includes("DenyLoginSubtask")
        ) {
          toast.error("No tweets found");
        } else if (result.result.includes("Username mismatch")) {
          toast.error("Username mismatch");
        } else if (result.result.includes("Incorrect number of arguments")) {
          toast.error("Internal server error");
        } else if (result.result.includes("DenyLoginSubtask")) {
          toast.error("Twitter firewalled. Try again later!");
        } else {
          toast.success(
            mode === "Tweeter"
              ? "User indexed successfully"
              : "Tweets indexed successfully"
          );
        }
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(
        mode === "Tweeter" ? "Error indexing user" : "Error indexing tweets"
      );
    }

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
            className={`${mode === "Tweet" ? "text-gray-600" : "text-blue-600"
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
            className={`${mode === "Tweeter" ? "text-gray-600" : "text-blue-600"
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
          key={`form-${mode}`}
          onSubmit={(e) => e.preventDefault()}
          className="relative flex flex-col gap-4 ml-8"
        >
          <div key={`dropdown-${mode}`} className="relative flex items-start w-full">
            <div className="max-w-xl mx-auto w-full">
              <Dropdown
                selectedClasses={selectedClasses}
                setSelectedClasses={setSelectedClasses}
                options={scamTwitterClassifiers}
                disabled={false}
              />
            </div>
            <span className="relative group ml-4 mt-3">
              <span className="cursor-pointer text-sm lg:text-lg text-gray-500">
                &#9432;
                <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-72 -translate-x-full lg:translate-x-0 -translate-y-full -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block">
                  {`This helps the AI with context about your input`}
                </span>
              </span>
            </span>
          </div>

          <div key={`input-${mode}`} className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={
                mode === "Tweeter"
                  ? "Enter Twitter/X @"
                  : "Enter tweet and press comma to add"
              }
              disabled={!selectedClasses || selectedClasses.length === 0}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={!selectedClasses || selectedClasses.length === 0}
              className={`px-6 py-3 ${mode === "Tweet" ? "bg-blue-600" : "bg-blue-600"
                } border ${mode === "Tweet" ? "border-blue-600" : "border-blue-600"
                } hover:bg-transparent rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Search className="w-6 h-6" />
            </button>
            <span className="relative group ml-4">
              <span className="cursor-pointer text-sm lg:text-lg text-gray-500">
                &#9432;
                <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-72 -translate-x-full lg:translate-x-0 -translate-y-full -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block">
                  {mode === "Tweeter"
                    ? "Enter the Twitter/X username to investigate"
                    : "Enter tweet links for analysis"}
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
            <div className="flex flex-wrap gap-2 -mt-[7.5px] w-full">
              {tweets.map((tweet, index) => (
                <div
                  key={index}
                  className="max-w-9/20 bg-gray-800 text-accent-steel px-2 py-[2px] lg:px-3 lg:py-1 rounded-md flex items-center gap-1"
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
      <ToastContainer {...toastContainerConfig} />
    </div>
  );
};
