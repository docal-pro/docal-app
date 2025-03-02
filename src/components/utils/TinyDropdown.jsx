import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const TinyDropdown = ({ selectedClass, setSelectedClass, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg flex justify-between items-center text-gray-400 focus:outline-none focus:border-green-500"
            >
                {selectedClass || "Select Class"}
                <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {options.map((option) => (
                        <div
                            key={option}
                            onClick={() => {
                                setSelectedClass(option);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 text-gray-200 hover:bg-gray-700 cursor-pointer"
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};