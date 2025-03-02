import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Sidebar } from "./components/Sidebar";
import { Twitter } from "./components/sidebar/investigate/Twitter";
import { Discourse } from "./components/sidebar/investigate/Discourse";
import { Dashboard } from "./components/sidebar/Dashboard";
import { SubmitInfo } from "./components/sidebar/SubmitInfo";
import { TinyDropdown } from "./components/utils/TinyDropdown";

const Investigate = () => {
    return (<></>);
};

const sections = [
    { name: "dashboard", label: "Dashboard", component: Dashboard },
    {
        name: "investigate",
        label: "Investigate",
        component: Investigate,
        subItems: [
            { name: "twitter", label: "Twitter", component: Twitter },
            { name: "discourse", label: "Discourse", component: Discourse }
        ]
    },
    { name: "submit_info", label: "Submit Information", component: SubmitInfo },
];

const App = () => {
    const [selectedSection, setSelectedSection] = useState("dashboard");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const foundSection = sections.find(s => {
        if (s.name === selectedSection) {
            return true;
        }
        if (s.subItems) {
            const subItemMatch = s.subItems.find(sub => `${s.name}_${sub.name}` === selectedSection);
            return !!subItemMatch;
        }
        return false;
    });

    const SelectedComponent = foundSection?.subItems?.find(sub =>
        `${foundSection.name}_${sub.name}` === selectedSection
    )?.component ||
        sections.find(s => s.name === selectedSection)?.component;

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
            <Navbar />

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center px-6 pt-16 pb-12 bg-black bg-opacity-25 w-full gap-8">
                <h2 className="text-2xl lg:text-4xl font-bold text-center bg-gradient-to-br from-gray-300 to-gray-200 bg-clip-text text-transparent font-ocr tracking-tight">
                    Crypto and Web3 Watchdog
                </h2>

                {/* Mobile Dropdown for Sidebar */}
                <div className="md:hidden w-full">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full text-left bg-gray-800 text-gray-300 py-3 px-4 rounded-md flex justify-between items-center"
                    >
                        {sections.find((s) => s.name === selectedSection)?.label || "Select Section"}
                        <span>{isDropdownOpen ? <i className="fa-solid fa-arrow-up"></i> : <i className="fa-solid fa-arrow-down"></i>}</span>
                    </button>
                    {isDropdownOpen && (
                        <ul className="bg-gray-800 rounded-md mt-2">
                            {sections.map((section) => (
                                <>
                                    <li
                                        key={section.name}
                                        onClick={() => { setSelectedSection(section.name); setIsDropdownOpen(false); }}
                                        className="px-4 py-2 hover:bg-accent-steel hover:bg-opacity-30 cursor-pointer"
                                    >
                                        {section.label}
                                    </li>
                                    {section.subItems && section.subItems.map((subItem) => (
                                        <li
                                            key={`${section.name}-${subItem.name}`}
                                            onClick={() => { setSelectedSection(`${section.name}_${subItem.name}`); setIsDropdownOpen(false); }}
                                            className="px-8 py-2 hover:bg-accent-steel hover:bg-opacity-30 cursor-pointer text-sm"
                                        >
                                            {subItem.label}
                                        </li>
                                    ))}
                                </>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Desktop Layout */}
                <div className="flex w-full max-w-5xl">
                    {/* Sidebar (Hidden on Mobile) */}
                    <div className="hidden md:block w-1/4">
                        <Sidebar sections={sections} selected={selectedSection} onSelect={setSelectedSection} />
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-3/4 flex justify-center">
                        {SelectedComponent && <SelectedComponent />}
                    </div>
                </div>
            </main>

            {/* Footer Sticks to Bottom */}
            <footer className="text-center">
                <Footer />
            </footer>
        </div>
    );
};

export default App;
