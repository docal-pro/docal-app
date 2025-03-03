import { InvestigateX } from "../components/sidebar/investigate/Twitter";

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
export const fakeUsernames = [
  "@crypto_scammer",
  "@honest_trader",
  "@shady_dealer",
  "@blockchain_boss",
  "@nft_hoarder",
  "@pump_and_dump",
  "@wallet_whale",
  "@rugpull_rick",
  "@defi_guru",
  "@moon_maniac",
  "@airdropped",
  "@token_flipz",
  "@eth_evader",
  "@solana_sniper",
  "@scam_alert",
  "@anon_hodler",
  "@metaverse_mogul",
  "@binance_bandit",
  "@whale_watcher",
  "@dust_attack",
];

export const fakeUsers = fakeUsernames.map((username, i) => ({
  id: i + 1,
  username,
  tweet_count: Math.floor(Math.random() * 1000),
  score: Math.floor(Math.random() * 101),
  trust: ["Unknown", "Safe", "Low", "Medium", "High", "Scam"][
    Math.floor(Math.random() * 6)
  ],
  investigate: Math.floor(Math.random() * 5),
}));

export const processScore = (db) => {
  return db.map((user, i) => ({
    id: i + 1,
    username: user.username,
    tweet_count: user.tweet_count,
    score: user.score,
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
    investigate: user.investigate,
  }));
};
