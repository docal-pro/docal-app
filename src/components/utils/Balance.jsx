import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { CheckCircle, CircleCheck, XCircle, CircleAlert } from "lucide-react";
import { defaultSchedule, useIsMobile, useIsTablet } from "../../utils/utils";
import { callProxy } from "../../utils/api";

export const Balance = ({ setIsScheduleOpen }) => {
  const { wallet, connected } = useWallet();
  const [schedule, setSchedule] = useState([]);
  const [emptySchedule, setEmptySchedule] = useState(true);
  const [fetchSchedule, setFetchSchedule] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const helpText = (timeLeft) => {
    const timeLeftInSeconds = Math.floor(timeLeft / 1000);
    if (timeLeftInSeconds > 0) {
      const hours = Math.floor(timeLeft / 3600000);
      const minutes = Math.floor((timeLeft % 3600000) / 60000);
      return <div className="text-gray-400 flex items-center space-x-2 -mb-[4px] mt-4">
        <div className="text-orange-400 text-lg"><CircleAlert /></div>
        <div className="text-gray-400 font-mono tracking-normal text-xs">{`Pending scheduled posts are processed once every 24 hours. You will be able to make further posts in ${hours} hours and ${minutes} minutes`}</div>
      </div>;
    } else {
      return <div className="text-gray-400 text-sm flex items-center space-x-2 -mb-[4px] mt-4">
        <CircleCheck className="text-green-400" />
        <div className="text-gray-400 font-mono tracking-normal">{"You can make posts now"}</div>
      </div>;
    }
  }

  const MetadataItem = ({ label, value, tooltip }) => (
    <div className="flex items-center space-x-3 w-full justify-between space-y-1">
      <div className="min-w-20 text-gray-400 text-xs tracking-word relative group">
        <span className="flex items-center space-x-2 hover:text-gray-200 transition-colors cursor-pointer pl-1">
          &#9432; {label.includes('_') ? label.split('_')[0].charAt(0).toUpperCase() + label.split('_')[0].slice(1) + 's' : label.charAt(0).toUpperCase() + label.slice(1)}
        </span>
        <span className="absolute text-xs p-2 bg-black rounded-md w-64 translate-x-0 lg:-translate-x-1/2 -translate-y-full -mt-6 md:-mt-8 text-center hidden group-hover:block font-grotesk text-gray-300">
          {tooltip}
        </span>
      </div>
      <div className="flex items-center space-x-1">
        {Array.isArray(value) ? (
          <div className="px-2 py-1 bg-black bg-opacity-60 rounded text-gray-200 text-xs font-mono hover:bg-opacity-100 transition-colors text-left tracking-normal">
            {value.length}
          </div>
        ) :
          <div className="px-2 py-1 bg-black bg-opacity-60 rounded text-gray-200 text-xs font-mono hover:bg-opacity-100 transition-colors text-left tracking-normal">
            {(isMobile || isTablet) && ["caller", "transaction"].includes(label) ? value.slice(0, 12) + "..." + value.slice(-10) : label === "timestamp" ? new Date(value.replace(" ", "T").split("+")[0] + "Z").toLocaleString("en-GB", {
              year: "numeric",
              month: "short",
              day: "numeric",
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false
            }) : value}
          </div>
        }
      </div>
    </div>
  );

  useEffect(() => {
    if (!connected) {
      toast.error("Please connect your wallet");
      setIsScheduleOpen(false);
      return;
    }
  }, [connected, setIsScheduleOpen]);

  useEffect(() => {
    const getSchedule = async () => {
      if (!wallet.adapter.publicKey) return;

      setIsModalOpen(true);
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
            if (userSchedule.tweet_ids.length > 0 || userSchedule.username !== "@") {
              setEmptySchedule(false);
              setSchedule(userSchedule);
            } else {
              setEmptySchedule(true);
              setSchedule(defaultSchedule);
            }
          } else {
            setEmptySchedule(true);
            setSchedule(defaultSchedule);
          }
        } else {
          throw new Error("❌ Failed to fetch schedule");
        }
      } catch (error) {
        console.error("❌ Error:", error);
        toast.error("Error fetching database");
      } finally {
        setIsModalOpen(false);
      }
    };

    if (connected && wallet.adapter.publicKey && fetchSchedule) {
      getSchedule();
      setFetchSchedule(false);
    }
  }, [connected, wallet, fetchSchedule]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md lg:max-w-lg">
        <div className="modal-content">
          <h2 className="text-xl font-bold text-accent-steel mb-4">Your Account</h2>
          {!emptySchedule && (
            <div>
              <div className="flex items-center space-x-2 flex-row mb-4">
                <XCircle className="text-red-400" />
                <div className="text-gray-300 text-sm -mb-[1.5px]">
                  {"Pending scheduled posts"}
                </div>
              </div>
              {schedule.map((item, index) => (
                <div key={index}>
                  {Object.entries(item).map(([key, value]) => (
                    <MetadataItem
                      key={`${index}-${key}`}
                      label={key}
                      value={emptySchedule ? "" : value}
                      tooltip={key === "timestamp" ? "Submission time of the scheduled post" : key === "caller" ? "Wallet address of the caller" : key === "transaction" ? "Transaction hash of the scheduled post" : key === "username" ? "Username of the target account" : key === "tweet_ids" ? "Number of tweets in the batch" : key === "contexts" ? "Number of contexts (blames) in the batch" : key}
                    />
                  ))}
                </div>
              ))}
              <div className="text-gray-400 text-xs font-mono tracking-normal mt-2 mb-2">
                {helpText(24 * 60 * 60 * 1000 - (new Date() - new Date(schedule[0].timestamp.replace(" ", "T").split("+")[0] + "Z")))}
              </div>
            </div>
          )}
          {emptySchedule && (
            <div className="flex flex-col items-start">
              <div className="flex items-center space-x-2 flex-row">
                <CheckCircle className="text-green-400" />
                <div className="text-gray-300 text-sm font-mono tracking-normal">
                  {"No scheduled posts"}
                </div>
              </div>
              <div className="text-gray-400 text-xs font-mono tracking-normal -mt-2 mb-2">
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setFetchSchedule(true);
              }}
              className="mt-4 mr-2 px-3 py-2 bg-accent-steel/50 text-white rounded-md hover:bg-accent-steel/20 transition text-sm"
            >
              Refresh
            </button>
            <button
              onClick={() => setIsScheduleOpen(false)}
              className="mt-4 px-3 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-primary/50 transition text-sm"
            >
              Close
            </button>
          </div>
        </div>
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
