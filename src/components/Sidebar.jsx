import { useState } from "react";

export const Sidebar = ({ sections, onSelect, selected }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  return (
    <div className="w-64 bg-gray-800 bg-opacity-30 p-4 rounded-lg max-h-100 overflow-y-auto scrollbar">
      <h2 className="text-sm font-bold text-gray-600 mb-4 font-ocr">Menu</h2>
      <ul>
        {sections.map((section) => (
          <li key={section.name} className="mb-2">
            <button
              onClick={() => {
                if (section.subItems) {
                  setExpandedSection(
                    expandedSection === section.name ? null : section.name
                  );
                }
                onSelect(section.name);
              }}
              className={`w-full px-4 py-2 text-left rounded-md transition ${
                selected === section.name
                  ? "bg-accent-steel bg-opacity-30 text-blue-300"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              {section.label}
            </button>

            {/* Sub-items dropdown */}
            {section.subItems && expandedSection === section.name && (
              <ul className="ml-4 mt-2 border-l-2 border-gray-700">
                {section.subItems.map((subItem) => (
                  <li key={subItem.name} className="mb-2">
                    <button
                      onClick={() =>
                        onSelect(`${section.name}_${subItem.name}`)
                      }
                      className={`w-full px-4 py-2 text-left rounded-md transition ${
                        selected === `${section.name}_${subItem.name}`
                          ? "bg-accent-steel bg-opacity-30 text-blue-300"
                          : "text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {subItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
