import { useState, useEffect, use } from "react";
import {
  defaultUsers,
  sanitise,
  getAction,
  getScoreColor,
  getTrustColor,
  dataColumns,
  actionColumns,
  getTweetIdFromLink,
  sortData,
  toastContainerConfig,
  toast,
} from "../../../utils/utils";
import { callProxy } from "../../../utils/api";
import { Input } from "../../utils/Input";
import { Classes } from "../../utils/Classes";
import { ToastContainer } from "react-toastify";
import { useWallet } from "@solana/wallet-adapter-react";
import "react-toastify/dist/ReactToastify.css";

export const TwitterDashboard = ({ userSchedule, setOutcome }) => {
  const { wallet } = useWallet();
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(null);
  const [contextualise, setContextualise] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isClassesOpen, setIsClassesOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!wallet) {
      toast.error("Please connect your wallet");
      return;
    }
  }, [wallet]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsModalOpen(true);
      try {
        const { status, result } = await callProxy("twitter/db");
        const headers = result.columns;
        const db = result.rows;
        // Check if DB is empty
        if (status === 200 && db.length > 0) {
          const users = sanitise(db);
          setUsers(users);
        } else {
          setUsers(defaultUsers);
        }
        setIsModalOpen(false);
      } catch (error) {
        console.error("❌ Error:", error);
        toast.error("Error fetching database");
        setIsModalOpen(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const contextualiseTweets = async () => {
      if (contextualise) {
        toast.default("Not yet implemented");
        setContextualise(false);
        return;
        setIsModalOpen(true);
        const username = active;
        const caller = wallet.adapter.publicKey.toString();
        if (!caller) {
          toast.error("Please connect your wallet");
          return;
        }
        const message = `Requesting signature to index with account ${caller}`;
        const signatureUint8Array = await wallet.adapter.signMessage(
          new TextEncoder().encode(message)
        );
        const transaction = btoa(String.fromCharCode(...signatureUint8Array));
        const tweetIds = [];

        // Post request to process
        try {
          handleInvestigate(tweetIds, "contextualise", username, caller, transaction);
          setActive(null);
        } catch (error) {
          console.error("❌ Error:", error);
          toast.error("Error contextualising tweets");
        }
        setIsModalOpen(false);
      }
    }
    contextualiseTweets();
  }, [contextualise, wallet]);

  const handleClassesSubmit = async (classes) => {
    setIsModalOpen(true);
    setIsClassesOpen(false);
    const username = active;
    const caller = wallet.adapter.publicKey.toString();
    if (!caller) {
      toast.error("Please connect your wallet");
      return;
    }
    const message = `Requesting signature to index with account ${caller}`;
    const signatureUint8Array = await wallet.adapter.signMessage(
      new TextEncoder().encode(message)
    );
    const transaction = btoa(String.fromCharCode(...signatureUint8Array));
    const tweetIds = [];

    // Post request to process
    try {
      handleInvestigate(tweetIds, "scrape", username, caller, transaction, classes);
      setActive(null);
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error processing tweets");
    }
    setIsModalOpen(false);
  };

  const handleTweetsSubmit = async (links) => {
    const username = active;
    const caller = wallet.adapter.publicKey.toString();
    if (!caller) {
      toast.error("Please connect your wallet");
      return;
    }
    const message = `Requesting signature to index with account ${caller}`;
    const signatureUint8Array = await wallet.adapter.signMessage(
      new TextEncoder().encode(message)
    );
    const transaction = btoa(String.fromCharCode(...signatureUint8Array));

    const tweetIds = [];
    for (const link of links) {
      const tweetId = getTweetIdFromLink(link);
      if (tweetId) {
        tweetIds.push(tweetId);
      }
    }
    // Post request to process
    try {
      handleInvestigate(tweetIds, "scrape", username, caller, transaction);
      setIsInputOpen(false);
      setActive(null);
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Error processing tweets");
    }
  };

  const handleInvestigate = async (slug, action, username = null, caller = null, transaction = null, classes = []) => {
    setIsModalOpen(true);
    if (!["scrape"].includes(action)) {
      console.error("❌ Not yet implemented");
      toast.default("Not yet implemented");
      setIsModalOpen(false);
      return;
    }
    const { status, result } = await callProxy("twitter/process", "POST", {
      func: getAction(action),
      user: username,
      data: slug.length > 0 ? slug.join(",") : ",",  // Passes tweet ids when scraping
      ctxs: classes.length > 0 ? classes.join(",") : ",", // Passes contexts when blames are added
      caller,
      transaction,
    });

    if (action === "contextualise") {
      setContextualise(false);
    }

    if (status === 200) {
      if (result.result.includes("Tweets already exist")) {
        toast.info("Tweets already indexed in database");
      } else if (result.result.includes("has already been indexed")) {
        toast.default("User already indexed in database");
      } else if (result.result.includes("No tweets found")) {
        toast.info("No tweets found. User indexed");
      } else if (result.result.includes("Username mismatch")) {
        toast.error("Username mismatch");
      } else if (result.result.includes("Incorrect number of arguments")) {
        toast.error("Internal server error");
      } else if (result.result.includes("DenyLoginSubtask") || result.result.includes("Please try again")) {
        toast.error("Twitter firewalled. Try again later!");
        setTimeout(() => {
          setOutcome(false);
        }, 3000);
      } else if (result.result.includes("Failed to fetch tweets")) {
        toast.error("Failed to fetch tweets");
      } else if (result.result.includes("Processing complete")) {
        const processed = result.result.match(/processed_tweets:\s*(\d+)/);
        const processedCount = processed ? processed[1] : 0;
        if (processedCount > 0) {
          const updatedUsers = users.map((user) => {
            if (user.username === username) {
              return { ...user, investigate: user.investigate + 1 };
            }
            return user;
          });
          setUsers(updatedUsers);
          toast.success(`Some tweets contextualised successfully`);
        } else {
          toast.error("Internal server error. No tweets contextualised");
        }
      } else if (result.result.includes("tweets saved to")) {
        const successRate = result.result.split("(")[1].split(")")[0].split("/");
        if (successRate[0] === successRate[1]) {
          toast.success("All tweets indexed successfully");
        } else {
          toast.success(`Some tweets indexed successfully. Duplicates ignored.`);
        }
      } else {
        toast.success(classes.length > 0 ? "Blames added successfully" : "Tweets indexed successfully");
      }
      setIsModalOpen(false);
    } else {
      console.error("❌ Error: " + result.error);
      toast.error("Error processing tweets");
      setIsModalOpen(false);
    }
  };

  const handleShare = async (user) => {
    console.error("❌ Not yet implemented");
    toast.default("Not yet implemented");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-0 md:px-4 lg:px-6 py-6 text-gray-300 -mt-6 max-h-[600px] text-xs md:text-sm lg:text-md overflow-y-auto scrollbar">
      <div className="mx-1 lg:mx-0 mb-4 relative">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 pl-8 text-gray-300 rounded bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2"></i>
      </div>
      <div className="overflow-x-auto rounded-lg scrollbar">
        <table className="w-full border border-gray-700 text-left rounded-lg overflow-hidden">
          <thead className="bg-gray-700 font-ocr tracking-tight">
            <tr>
              {dataColumns.map(({ key, label }, index) => (
                <th
                  key={index}
                  className="lg:min-w-auto min-w-24 px-0 pt-2 pb-1 lg:px-4 border border-gray-600 cursor-pointer hover:bg-gray-600 transition text-center text-accent-steel"
                  onClick={() =>
                    sortData(key, sortConfig, setSortConfig, setUsers)
                  }
                >
                  {label}{" "}
                  {sortConfig.key === key && (
                    <span className="text-xs">
                      {sortConfig.direction === "asc" ? (
                        <i className="fa-solid fa-arrow-up"></i>
                      ) : (
                        <i className="fa-solid fa-arrow-down"></i>
                      )}
                    </span>
                  )}
                </th>
              ))}
              {actionColumns.map((col, index) => (
                <th
                  key={index}
                  className="px-7 pt-2 pb-1 lg:px-4 border border-gray-600 text-center"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index} className="odd:bg-gray-900 even:bg-gray-800">
                <td className="lg:px-4 px-1 pl-2 py-0 lg:py-2 border border-gray-700 text-accent-steel">
                  {user.username}
                </td>
                <td
                  className={`lg:px-4 px-1 pl-9 lg:pl-2 py-0 lg:py-2 border border-gray-700 ${getScoreColor(
                    user.score
                  )}`}
                >
                  {user.score}
                  <span className="text-[3px]"> </span>
                  <span className="font-ocr text-gray-500 text-md">{"%"}</span>
                </td>
                <td
                  className={`lg:px-4 px-1 pl-4 lg:pl-2 py-0 lg:py-2 border border-gray-700 ${getTrustColor(
                    user.trust
                  )}`}
                >
                  {user.trust}
                </td>

                {/* Action Buttons */}
                <td className="lg:px-4 pl-2 py-1 lg:py-2 border border-gray-700 text-center">
                  <button
                    onClick={() => {
                      setActive(user.username), setIsInputOpen(true);
                    }}
                    className={`mx-[2px] px-1 lg:px-2 py-1 ${user.investigate < 1
                      ? "bg-white bg-opacity-10"
                      : "bg-blue-400 bg-opacity-70"
                      } hover:bg-transparent rounded relative group disabled:cursor-not-allowed`}
                    disabled={userSchedule}
                  >
                    <i className="fa-solid fa-file-arrow-down"></i>
                    <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-32 -translate-x-full lg:-translate-x-full -translate-y-1/2 -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block z-10">
                      {`Add tweets`}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setActive(user.username);
                      setIsClassesOpen(true);
                    }}
                    className={`mx-[2px] px-1 lg:px-2 py-1 ${user.investigate < 1
                      ? "bg-white bg-opacity-10"
                      : "bg-blue-400 bg-opacity-70"
                      } hover:bg-transparent rounded relative group disabled:cursor-not-allowed`}
                    disabled={userSchedule}
                  >
                    <i className="fa-solid fa-object-group"></i>
                    <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-32 -translate-x-full lg:-translate-x-full -translate-y-1/2 -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block z-10">
                      {`Add classes to blame`}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setActive(user.username);
                      setContextualise(true);
                    }
                    }
                    className={`mx-[2px] px-1 lg:px-2 py-1 ${user.investigate < 2
                      ? "bg-white bg-opacity-10"
                      : "bg-blue-400 bg-opacity-70"
                      } hover:bg-transparent rounded relative group disabled:cursor-not-allowed ${contextualise ? "animate-pulse" : ""}`}
                    disabled={userSchedule}
                  >
                    <i className="fa-solid fa-mortar-pestle"></i>
                    <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-36 -translate-x-full lg:-translate-x-full -translate-y-1/2 -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block z-10">
                      {`Contextualise information`}
                    </span>
                  </button>
                  <button
                    onClick={() => handleInvestigate(user.username, "classify")}
                    className={`mx-[2px] px-1 lg:px-2 py-1 ${user.investigate < 3
                      ? "bg-white bg-opacity-10"
                      : "bg-blue-400 bg-opacity-70"
                      } hover:bg-transparent rounded relative group disabled:cursor-not-allowed`}
                    disabled={userSchedule}
                  >
                    <i className="fa-solid fa-list-check"></i>
                    <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-32 -translate-x-full lg:-translate-x-full -translate-y-1/2 -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block z-10">
                      {`Classify information`}
                    </span>
                  </button>
                  <button
                    onClick={() => handleInvestigate(user.username, "extract")}
                    className={`mx-[2px] px-1 lg:px-2 py-1 ${user.investigate < 4
                      ? "bg-white bg-opacity-10"
                      : "bg-blue-400 bg-opacity-70"
                      } hover:bg-transparent rounded relative group disabled:cursor-not-allowed`}
                    disabled={userSchedule}
                  >
                    <i className="fa-solid fa-object-group"></i>
                    <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-32 -translate-x-full lg:-translate-x-full -translate-y-1/2 -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block z-10">
                      {`Extract`}
                    </span>
                  </button>
                  <button
                    onClick={() => handleInvestigate(user.username, "evaluate")}
                    className={`mx-[2px] px-1 lg:px-2 py-1 ${user.investigate < 5
                      ? "bg-white bg-opacity-10"
                      : "bg-blue-400 bg-opacity-70"
                      } hover:bg-transparent rounded relative group disabled:cursor-not-allowed`}
                    disabled={userSchedule}
                  >
                    <i className="fa-solid fa-scale-unbalanced-flip"></i>
                    <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-32 -translate-x-full lg:-translate-x-full -translate-y-1/2 -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block z-10">
                      {`Evaluate`}
                    </span>
                  </button>
                </td>
                <td className="lg:px-4 pl-2 py-1 lg:py-2 border border-gray-700 text-center">
                  <button
                    onClick={() => handleShare(user)}
                    disabled
                    className="px-2 py-1 bg-white bg-opacity-10 rounded relative group disabled:cursor-not-allowed disabled:bg-opacity-10"
                  >
                    <i className="fa-solid fa-bug-slash"></i>
                    <span className="font-ocr absolute text-xs lg:text-md tracking-tight p-2 bg-black rounded-md w-26 -translate-x-full lg:-translate-x-full -translate-y-1/2 -mt-6 md:-mt-8 text-center text-gray-300 hidden group-hover:block z-10">
                      {`Share`}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      <Input
        isOpen={isInputOpen}
        onClose={() => {
          setIsInputOpen(false);
        }}
        onSubmit={handleTweetsSubmit}
      />
      <Classes
        isOpen={isClassesOpen}
        onClose={() => setIsClassesOpen(false)}
        onSubmit={handleClassesSubmit}
      />
      <ToastContainer {...toastContainerConfig} />
    </div>
  );
};
