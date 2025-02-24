import { useState } from "react";

export const Sidebar = ({ sections, onSelect, selected }) => {
    return (
        <div className="w-64 h-full bg-gray-800 bg-opacity-30 p-4 rounded-lg max-h-60 overflow-y-auto scrollbar">
            <h2 className="text-sm font-bold text-gray-600 mb-4 font-ocr">Menu</h2>
            <ul>
                {sections.map((section) => (
                    <li key={section.name} className="mb-2">
                        <button
                            onClick={() => onSelect(section.name)}
                            className={`w-full px-4 py-2 text-left rounded-md transition ${selected === section.name
                                ? "bg-accent-steel bg-opacity-30 text-blue-300"
                                : "text-gray-400 hover:bg-gray-700"
                                }`}
                        >
                            {section.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

