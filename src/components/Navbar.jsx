import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Github, Twitter } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Balance } from "./utils/Balance";
import { callProxy } from "../utils/api";
import { defaultSchedule } from "../utils/utils";

export const Navbar = ({ setUserSchedule }) => {
  const { wallet } = useWallet();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [canSchedule, setCanSchedule] = useState(false);
  const [canUserSchedule, setCanUserSchedule] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const dropdownRefs = useRef({});

  useEffect(() => {
    setUserSchedule(!canUserSchedule);
  }, [canUserSchedule]);

  useEffect(() => {
    const fetchUserSchedule = async () => {
      try {
        const { status, result } = await callProxy(`twitter/schedule`, "POST", {
          query: wallet.adapter.publicKey.toString(),
        });
        if (status === 200) {
          if (result.rows && result.rows.length > 0 &&
            JSON.stringify(result.rows) !== JSON.stringify(defaultSchedule)) {
            const userSchedule = result.rows.map(row => ({
              ...row,
              caller: wallet.adapter.publicKey.toString()
            }))
            if (userSchedule.tweet_ids?.length > 0 || userSchedule.username !== "@") {
              setCanUserSchedule(false);
            } else {
              setCanUserSchedule(true);
            }
          } else {
            setCanUserSchedule(true);
          }
        } else {
          throw new Error("❌ Failed to fetch schedule");
        }
      } catch (error) {
        console.error("❌ Error:", error);
        toast.error("Error fetching database");
      }
    }
    if (wallet && isWalletConnected) {
      fetchUserSchedule();
    }
  }, [wallet, isWalletConnected]);

  // Check if the wallet is connected and log the status
  useEffect(() => {
    if (wallet) {
      if (wallet.adapter.publicKey) {
        setIsWalletConnected(true);
        console.log("✅ Wallet connected");
      } else {
        setIsWalletConnected(false);
        console.log("❌ Wallet not connected");
      }
    }
  }, [wallet]);

  useEffect(() => {
    // Check if the component is mounted to prevent hydration errors
    // when the wallet button is rendered on the server
    setIsMounted(true);
  }, []);

  const handleClickOutside = (event) => {
    if (
      activeDropdown &&
      !dropdownRefs.current[activeDropdown]?.contains(event.target)
    ) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const isDropdownOpen = (dropdownName) => activeDropdown === dropdownName;

  return (
    <nav className="w-full p-4 bg-black bg-opacity-75 border-b border-gray-700">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-4 mb-5 xs:mb-0 lg:mb-0 xl:mb-0">
          <img
            src="./assets/logo-light.png"
            width="80"
            className="transition-transform logo-rotate"
            alt="DOCAL Logo"
          />
          <div className="flex flex-col items-start">
            <h1 className="text-4xl font-bold text-white mt-2 font-ocr">
              DOCAL <span className="text-gray-400">AI</span>
            </h1>
            <h2 className="text-sm lg:text-md font-bold text-center bg-gradient-to-br from-gray-300 to-gray-200 bg-clip-text text-transparent font-ocr tracking-tight">
              Decentralised Organisation
              <br />
              for Class-Action Lawsuits
            </h2>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div
          className={`${isMobileMenuOpen ? "block" : "hidden"
            } md:block w-full md:w-auto font-ocr tracking-tight`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mt-4 md:mt-0">
            {/* Resources Dropdown */}
            <div
              ref={(el) => (dropdownRefs.current.resources = el)}
              className="relative"
            >
              <button
                onClick={() => toggleDropdown("resources")}
                className="flex items-center gap-1 text-white hover:text-green-400 transition-colors"
              >
                Resources
                <ChevronDown size={16} />
              </button>
              <div
                className={`${isDropdownOpen("resources") ? "block" : "hidden"
                  } absolute left-0 mt-2 w-48 bg-black rounded-md shadow-lg py-1 z-50`}
              >
                <a
                  href="https://github.com/docal-pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-gray-800"
                >
                  <Github size={16} />
                  Codebase
                </a>
              </div>
            </div>

            {/* Community Dropdown */}
            <div
              ref={(el) => (dropdownRefs.current.community = el)}
              className="relative"
            >
              <button
                onClick={() => toggleDropdown("community")}
                className="flex items-center gap-1 text-white hover:text-green-400 transition-colors"
              >
                Community
                <ChevronDown size={16} />
              </button>
              <div
                className={`${isDropdownOpen("community") ? "block" : "hidden"
                  } absolute left-0 mt-2 w-48 bg-black rounded-md shadow-lg py-1 z-50`}
              >
                <a
                  href="https://x.com/docal_pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-gray-800"
                >
                  <Twitter size={16} />X
                </a>
              </div>
            </div>

            {/* Apps Dropdown */}
            <div
              ref={(el) => (dropdownRefs.current.apps = el)}
              className="relative"
            >
              <button
                onClick={() => toggleDropdown("apps")}
                className="flex items-center gap-1 text-white hover:text-green-400 transition-colors"
              >
                Apps
                <ChevronDown size={16} />
              </button>
              <div
                className={`${isDropdownOpen("apps") ? "block" : "hidden"
                  } absolute left-0 mt-2 w-48 bg-black rounded-md shadow-lg py-1 z-50`}
              >
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-gray-800"
                >
                  DOCAL AI
                </a>
              </div>
            </div>

            <div className="flex flex-row items-center gap-4">
              {/* Schedule Button */}
              <button
                onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                className={`relative flex items-center gap-1 text-white hover:bg-accent-steel/20 transition-colors px-4 py-2 rounded-md text-sm ${isScheduleOpen ? "bg-accent-steel/20" : "bg-accent-steel/50"} disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={!wallet || !wallet.adapter.publicKey}
              >
                {!canUserSchedule && isWalletConnected && <span className="absolute -top-1 -right-1 text-red-500 animate-pulse">⚠️</span>}
                Account
              </button>
              {/* Wallet Button */}
              <div className="justify-self-end relative">
                {isMounted && (
                  <WalletMultiButton className="wallet-button" />
                )}
              </div>
            </div>
            {isScheduleOpen && <Balance setIsScheduleOpen={setIsScheduleOpen} setCanSchedule={setCanSchedule} />}
          </div>
        </div>
      </div>
    </nav>
  );
};
