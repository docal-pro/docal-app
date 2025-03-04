import { toast as toastify } from "react-toastify";
import { BadgeCheck, CircleAlert, BellRing, BellRingIcon } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

// Scam Classifiers
export const scamTwitterClassifiers = [
  "Promoting a scam",
  "Promoting pump & dump scheme",
  "Promoting a rug pull",
  "Partnering with scam project",
  "Partnering with scammer",
  "Irresponsible promotion",
  "Fake giveaways & airdrops",
  "Fake engagement farming",
  "Spreading misinformation",
  "Shilling low-liquidity tokens",
  "Using bot-driven manipulation",
  "Paid promotions without disclosure",
  "Multi-account astroturfing",
  "Promoting hacked wallets/tools",
  "Artificially inflating project hype",
  "Associating with known fraudsters",
  "Promoting Ponzi-like structures",
  "Encouraging FOMO-based investing",
  "Soliciting private keys or seed phrases",
  "Pump group leader/whale manipulation",
];

export const scamDiscourseClassifiers = [
  "Sybil Attacks",
  "Vote Buying",
  "Proposal Spamming",
  "Governance Takeover",
  "Insider Trading",
  "Collusion",
  "Low Voter Participation",
  "Smart Contract Exploits",
  "Whale Dominance",
  "Lack of Transparency",
  "Conflict of Interest",
  "Fake Proposals",
  "Inadequate Security Measures",
  "Regulatory Non-compliance",
  "Poor Governance Structures",
  "State Capture",
  "Self-Dealing",
  "Unfair Compensation",
  "Lack of Transparency",
  "Rogue Governance",
  "Unauthorised Actions",
];

// Fake Users
export const fakeUsernames = ["@fake_user"];

export const fakeUsers = fakeUsernames.map((username, i) => ({
  id: i + 1,
  username,
  tweet_count: Math.floor(Math.random() * 1000),
  score: Math.floor(Math.random() * 101),
  trust: ["Unknown", "Safe", "Low", "Medium", "High", "Scam"][
    Math.floor(Math.random() * 6)
  ],
  investigate: Math.floor(Math.random() * 6),
  contexts: [],
  timestamp: null,
}));

export const sanitise = (db) => {
  return db.map((user) => ({
    id: user.id, // Same as the 'id' in the DB
    username: user.username, // Same as the 'username' in the DB
    tweet_count: user.tweet_count, // Same as the 'tweet_count' in the DB
    score: user.score, // Same as the 'score' in the DB
    trust:
      user.trust === 0
        ? "Unknown"
        : user.trust === 1
        ? "Safe"
        : user.trust === 2
        ? "Low"
        : user.trust === 3
        ? "Medium"
        : user.trust === 4
        ? "High"
        : "Scam",
    investigate: user.investigate, // Same as the 'investigate' in the DB
    contexts: user.contexts, // Same as the 'contexts' in the DB
    timestamp: user.timestamp, // Same as the 'timestamp' in the DB
  }));
};

export const sortData = (key, sortConfig, setSortConfig, setUsers) => {
  let direction = "asc";
  if (sortConfig.key === key && sortConfig.direction === "asc") {
    direction = "desc";
  }
  setSortConfig({ key, direction });

  setUsers((prevUsers) => {
    return [...prevUsers].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  });
};

export const getScoreColor = (score) => {
  if (score < 33) return "text-orange-500";
  if (score < 67) return "text-blue-400";
  return "text-green-500";
};

export const getTrustColor = (trust) => {
  if (trust === "Scam") return "text-red-400";
  if (trust === "High") return "text-orange-400";
  if (trust === "Medium") return "text-blue-400";
  if (trust === "Low") return "text-lime-400";
  if (trust === "Safe") return "text-green-400";
  if (trust === "Unknown") return "text-gray-400";
};

export const getAction = (action) => {
  switch (action) {
    case "scrape":
      return "scraper";
    case "index":
      return "indexer";
    case "contextualise":
      return "context";
    case "classify":
      return "classifier";
    case "extract":
      return "extractor";
    case "evaluate":
      return "evaluator";
    default:
      return "";
  }
};

export const getTweetIdFromLink = (link) => {
  const url = new URL(link);
  const path = url.pathname;
  const tweetId = path.split("/").pop();
  return tweetId;
};

export const dataColumns = [
  { key: "username", label: "User" },
  { key: "score", label: "Score" },
  { key: "trust", label: "Trust" },
];

export const actionColumns = ["Investigate", "Share"];

// Base configuration for ToastContainer
export const toastContainerConfig = {
  autoClose: 6000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

// Custom toast functions with styled notifications
export const toast = {
  default: (message) => {
    toastify(message, {
      position: "top-right",
      style: {
        background: "#111212",
        color: "rgb(255, 255, 255)",
        fontFamily: "OCR-A-Std",
        fontSize: "18px",
        border: "2px solid rgba(255, 255, 255, 0.8)",
        borderRadius: "8px",
        letterSpacing: "-0.075em",
      },
      progressStyle: {
        background: "rgba(255, 255, 255, 0.8)",
      },
      icon: <BellRingIcon className="stroke-[rgb(255, 149, 0)]" />,
    });
  },

  info: (message) => {
    toastify(message, {
      position: "top-right",
      style: {
        background: "#111212",
        color: "rgb(0, 157, 255)",
        fontFamily: "OCR-A-Std",
        fontSize: "18px",
        border: "2px solid rgba(0, 157, 255, 0.8)",
        borderRadius: "8px",
        letterSpacing: "-0.075em",
      },
      progressStyle: {
        background: "rgba(0, 157, 255, 0.8)",
      },
      icon: <BadgeCheck className="stroke-[rgb(0, 157, 255)]" />,
    });
  },

  success: (message) => {
    toastify(message, {
      position: "top-right",
      style: {
        background: "#111212",
        color: "#48ff00",
        fontFamily: "OCR-A-Std",
        fontSize: "18px",
        border: "2px solid #48ff00c1",
        borderRadius: "8px",
        letterSpacing: "-0.075em",
      },
      progressStyle: {
        background: "#48ff00c1",
      },
      icon: <BadgeCheck className="stroke-[#48ff00]" />,
    });
  },

  error: (message) => {
    toastify(message, {
      position: "top-right",
      style: {
        background: "#111212",
        color: "#ff1500",
        fontFamily: "OCR-A-Std",
        fontSize: "18px",
        border: "2px solid #ff1500c1",
        borderRadius: "8px",
        letterSpacing: "-0.075em",
      },
      progressStyle: {
        background: "#ff1500c1",
      },
      icon: <CircleAlert className="stroke-[#ff1500]" />,
    });
  },
};
