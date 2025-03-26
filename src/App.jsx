import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Sidebar } from "./components/Sidebar";
import { Twitter } from "./components/sidebar/investigate/Twitter";
import { Discourse } from "./components/sidebar/investigate/Discourse";
import { TwitterDashboard } from "./components/sidebar/dashboard/Twitter";
import { DiscourseDashboard } from "./components/sidebar/dashboard/Discourse";
import { SubmitInfo } from "./components/sidebar/SubmitInfo";
import { useWallet } from "@solana/wallet-adapter-react";

const sections = [
  {
    name: "dashboard",
    label: "Dashboard",
    component: (props) => <Dashboard {...props} />,
    subItems: [
      { name: "twitter", label: "Twitter", component: TwitterDashboard },
      { name: "discourse", label: "Discourse", component: DiscourseDashboard },
    ],
  },
  {
    name: "investigate",
    label: "Investigate",
    component: (props) => <Investigate {...props} />,
    subItems: [
      { name: "twitter", label: "Twitter", component: Twitter },
      { name: "discourse", label: "Discourse", component: Discourse },
    ],
  },
  { name: "submit_info", label: "Submit Information", component: SubmitInfo },
];

const Dashboard = ({ onSelect }) => {
  const dashboardSection = sections.find((s) => s.name === "dashboard");

  return (
    <div className="flex flex-col items-center justify-center w-3/4 text-center font-ocr gap-8 lg:mt-12 md:mt-12">
      <div className="tracking-tight text-gray-400">{`Please select a dashboard to continue`}</div>
      <div className="flex gap-4">
        {dashboardSection?.subItems?.map((subItem) => (
          <button
            key={subItem.name}
            onClick={() => onSelect(`dashboard_${subItem.name}`)}
            className="px-6 py-3 bg-accent-steel bg-opacity-30 rounded-md hover:bg-opacity-50 transition-all text-blue-300 hover:text-blue-100 tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {subItem.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const Investigate = ({ onSelect }) => {
  const investigateSection = sections.find((s) => s.name === "investigate");

  return (
    <div className="flex flex-col items-center justify-center w-3/4 text-center font-ocr gap-8 lg:mt-12 md:mt-12">
      <div className="tracking-tight text-gray-400">{`Please select a platform to continue`}</div>
      <div className="flex gap-4">
        {investigateSection?.subItems?.map((subItem) => (
          <button
            key={subItem.name}
            onClick={() => onSelect(`investigate_${subItem.name}`)}
            className="px-6 py-3 bg-accent-steel bg-opacity-30 rounded-md hover:bg-opacity-50 transition-all text-blue-300 hover:text-blue-100 tracking-tight"
          >
            {subItem.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { wallet } = useWallet();
  
  const foundSection = sections.find((s) => {
    if (s.name === selectedSection) {
      return true;
    }
    if (s.subItems) {
      const subItemMatch = s.subItems.find(
        (sub) => `${s.name}_${sub.name}` === selectedSection
      );
      return !!subItemMatch;
    }
    return false;
  });

  const SelectedComponent =
    foundSection?.subItems?.find(
      (sub) => `${foundSection.name}_${sub.name}` === selectedSection
    )?.component || sections.find((s) => s.name === selectedSection)?.component;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center px-6 pt-16 pb-12 bg-black bg-opacity-25 w-full gap-8">
        <h2 className="text-2xl lg:text-4xl font-bold text-center bg-gradient-to-br from-gray-300 to-gray-200 bg-clip-text text-transparent font-ocr tracking-tight">
          Crypto and Web3 Watchdog
        </h2>

        {/* Mobile Dropdown for Sidebar */}
        <div className="lg:hidden w-full">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full text-left bg-gray-800 text-gray-300 py-3 px-4 rounded-md flex justify-between items-center"
          >
            {sections.find((s) => s.name === selectedSection)?.label ||
              "Select Section"}
            <span>
              {isDropdownOpen ? (
                <i className="fa-solid fa-arrow-up"></i>
              ) : (
                <i className="fa-solid fa-arrow-down"></i>
              )}
            </span>
          </button>
          {isDropdownOpen && (
            <ul className="bg-gray-800 rounded-md mt-2">
              {sections.map((section) => (
                <>
                  <li
                    key={section.name}
                    onClick={() => {
                      setSelectedSection(section.name);
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-accent-steel hover:bg-opacity-30 cursor-pointer"
                  >
                    {section.label}
                  </li>
                  {section.subItems &&
                    section.subItems.map((subItem) => (
                      <li
                        key={`${section.name}-${subItem.name}`}
                        onClick={() => {
                          setSelectedSection(`${section.name}_${subItem.name}`);
                          setIsDropdownOpen(false);
                        }}
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
          <div className="hidden lg:block w-1/4">
            <Sidebar
              sections={sections}
              selected={selectedSection}
              onSelect={setSelectedSection}
            />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 flex lg:block justify-center">
            {SelectedComponent && (
              <SelectedComponent onSelect={setSelectedSection} />
            )}
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
