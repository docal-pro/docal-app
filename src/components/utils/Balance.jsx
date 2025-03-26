import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getTweetIdFromLink } from "../../utils/utils";
import { toast } from "react-toastify";
import { defaultSchedule } from "../../utils/utils";
import { callProxy } from "../../utils/api";


export const Balance = ({ setIsScheduleOpen }) => {
  const { wallet } = useWallet();
  const [schedule, setSchedule] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!wallet) {
      toast.error("Please connect your wallet");
      return;
    }
  }, [wallet]);

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsModalOpen(true);
      try {
        const { status, result } = await callProxy(`twitter/schedule`, "POST", {
          query: wallet.adapter.publicKey.toString(),
        });
        const headers = result.columns;
        let schedule = result.rows;
        console.log(schedule);
        // Check if DB is empty
        if (status === 200 && schedule.length > 0) {
          schedule.caller = wallet.adapter.publicKey.toString();
          setSchedule(schedule);
        } else {
          setSchedule(defaultSchedule);
        }
        setIsModalOpen(false);
      } catch (error) {
        console.error("❌ Error:", error);
        toast.error("Error fetching database");
        setIsModalOpen(false);
      }
    };
    if (wallet && wallet.adapter.publicKey) {
      fetchSchedule();
    }
  }, [wallet]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md lg:max-w-lg">
        <div className="modal-content">
          <h2 className="text-2xl font-bold text-white">Your Account</h2>
          <ul className="mt-4 text-gray-300">
            {schedule.map((item, index) => (
              <li key={index} className="py-2 border-b border-gray-700">
                <span className="font-semibold">{item.username}</span>: {item.transaction}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setIsScheduleOpen(false)}
            className="mt-4 px-4 py-2 bg-accent-steel/50 text-white rounded-md hover:bg-accent-steel/20 transition"
          >
            Close
          </button>
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
