import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const Dropdown = ({
  selectedClasses,
  setSelectedClasses,
  options,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (selectedClasses.includes(option)) {
      setSelectedClasses(selectedClasses.filter((item) => item !== option));
    } else {
      setSelectedClasses([...selectedClasses, option]);
    }
  };

  const removeSelected = (optionToRemove) => {
    setSelectedClasses(
      selectedClasses.filter((item) => item !== optionToRemove)
    );
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md flex justify-between items-center focus:outline-none focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed ${
          selectedClasses.length > 0 ? "text-gray-300" : "text-gray-500"
        }`}
        disabled={disabled}
      >
        {selectedClasses.length > 0
          ? `${selectedClasses.length} selected`
          : "Select Classes"}
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </button>

      {selectedClasses.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 w-full">
          {selectedClasses.map((selected) => (
            <div
              key={selected}
              className="max-w-9/20 bg-gray-800 text-accent-steel px-2 py-[2px] lg:px-3 lg:py-1 rounded-md flex items-center gap-1"
            >
              <span className="text-xs lg:text-sm w-full mr-2">{selected}</span>
              <button
                type="button"
                onClick={() => removeSelected(selected)}
                className="text-gray-400 hover:text-gray-200"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-gray-200 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={selectedClasses.includes(option)}
                onChange={() => {}}
                className="h-4 w-4 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 bg-black"
              />
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const TinyDropdown = ({
  selectedClasses,
  setSelectedClasses,
  options,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (selectedClasses.includes(option)) {
      setSelectedClasses(selectedClasses.filter((item) => item !== option));
    } else {
      setSelectedClasses([...selectedClasses, option]);
    }
  };

  const removeSelected = (optionToRemove) => {
    setSelectedClasses(
      selectedClasses.filter((item) => item !== optionToRemove)
    );
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-2 py-2 bg-gray-800 border border-gray-700 rounded-md flex justify-between items-center focus:outline-none focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-[15px] ${
          selectedClasses.length > 0 ? "text-gray-300" : "text-gray-500"
        }`}
        disabled={disabled}
      >
        {selectedClasses.length > 0
          ? `${selectedClasses.length} selected`
          : "Select Classes"}
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </button>

      {selectedClasses.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 w-full">
          {selectedClasses.map((selected) => (
            <div
              key={selected}
              className="max-w-9/20 bg-gray-800 text-accent-steel px-2 py-[3px] lg:px-3 lg:py-1 rounded-md flex items-center gap-1"
            >
              <span className="text-xs lg:text-sm w-full mr-2">{selected}</span>
              <button
                type="button"
                onClick={() => removeSelected(selected)}
                className="text-gray-400 hover:text-gray-200"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
            >
              <input
                type="checkbox"
                checked={selectedClasses.includes(option)}
                onChange={() => {}}
                className="h-3 w-3 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 bg-black"
              />
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
