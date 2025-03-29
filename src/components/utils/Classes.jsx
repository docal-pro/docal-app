import { useState } from "react";
import { TinyDropdown } from "./Dropdown";
import { scamTwitterClassifiers } from "../../utils/utils";

export const Classes = ({ isOpen, onClose, onSubmit }) => {
  const [selectedClasses, setSelectedClasses] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedClasses);
    setSelectedClasses([]);
  };

  if (!isOpen) return null;

  const handleModalClick = (e) => {
    // Only close if clicking the backdrop itself
    if (e.target === e.currentTarget) {
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleModalClick} // Changed from onClose to handleModalClick
    >
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md lg:max-w-lg">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-6"
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h2 className="text-xl font-ocr text-gray-300 tracking-tight">
                Select Classes
              </h2>
              <h3 className="text-sm font-mono text-gray-500">
                • add blames to tweets
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
            <div className="max-w-xl mx-auto w-full">
              <TinyDropdown
                selectedClasses={selectedClasses}
                setSelectedClasses={setSelectedClasses}
                options={scamTwitterClassifiers}
                disabled={false}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedClasses([]);
                onClose();
              }}
              className="px-4 py-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 font-ocr tracking-tight text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
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
