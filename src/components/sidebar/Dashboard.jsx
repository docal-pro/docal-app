import { useState, useEffect } from "react";
import { fakeUsers, processScore } from "../../utils/utils";
import { callProxy } from "../../utils/api";

export const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [searchQuery, setSearchQuery] = useState("");

    const dataColumns = [
        { key: "username", label: "User" },
        { key: "score", label: "Score" },
        { key: "trust", label: "Trust" },
    ];

    const actionColumns = ["Investigate", "Slash", "Share"];

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await callProxy('db');
            const headers = data.columns;
            const db = data.rows;
            // Check if db is empty
            if (db.length > 0) {
                const users = processScore(db);
                setUsers(users);
            } else {
                setUsers(fakeUsers);
            }
        };
        fetchUsers();
    }, []);

    const sortData = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        setUsers((prevUsers) => {
            return [...prevUsers].sort((a, b) => {
                if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
                if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
                return 0;
            });
        });
    };

    const getScoreColor = (score) => {
        if (score < 33) return "text-orange-500";
        if (score < 67) return "text-blue-400";
        return "text-green-500";
    };

    const getTrustColor = (trust) => {
        if (trust === "Scam") return "text-red-400";
        if (trust === "High") return "text-orange-400";
        if (trust === "Medium") return "text-blue-400";
        if (trust === "Low") return "text-lime-400";
        if (trust === "Safe") return "text-green-400";
        if (trust === "Unknown") return "text-gray-400";
    };

    const filteredUsers = users.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="w-full max-w-6xl mx-auto px-0 md:px-4 lg:px-6 py-6 text-gray-300 -mt-6 max-h-[600px] text-xs md:text-sm lg:text-md overflow-y-auto scrollbar">
            <div className="mx-1 lg:mx-0 mb-4 relative">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full p-2 pl-8 text-gray-300 rounded bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2"></i>
            </div>
            <div className="overflow-x-auto rounded-lg scrollbar">
                <table className="w-full border border-gray-700 text-left rounded-lg overflow-hidden">
                    <thead className="bg-gray-700 font-ocr tracking-tight">
                        <tr>
                            {dataColumns.map(({ key, label }, index) => (
                                <th
                                    key={index}
                                    className="lg:min-w-auto min-w-24 px-0 pt-2 pb-1 lg:px-4 border border-gray-600 cursor-pointer hover:bg-gray-600 transition text-center text-accent-steel"
                                    onClick={() => sortData(key)}
                                >
                                    {label} {" "}
                                    {sortConfig.key === key && (
                                        <span className="text-xs">
                                            {sortConfig.direction === "asc" ? <i className="fa-solid fa-arrow-up"></i> : <i className="fa-solid fa-arrow-down"></i>}
                                        </span>
                                    )}
                                </th>
                            ))}
                            {actionColumns.map((col, index) => (
                                <th key={index} className="px-6 pt-2 pb-1 lg:px-4 border border-gray-600 text-center">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="odd:bg-gray-900 even:bg-gray-800">
                                <td className="lg:px-4 px-1 pl-2 py-0 lg:py-2 border border-gray-700 text-accent-steel">{user.username}</td>
                                <td className={`lg:px-4 px-1 pl-9 lg:pl-2 py-0 lg:py-2 border border-gray-700 ${getScoreColor(user.score)}`}>
                                    {user.score}<span className="text-[3px]">{" "}</span>
                                    <span className="font-ocr text-gray-500 text-md">{"%"}</span>
                                </td>
                                <td className={`lg:px-4 px-1 pl-4 lg:pl-2 py-0 lg:py-2 border border-gray-700 ${getTrustColor(user.trust)}`}>{user.trust}</td>

                                {/* Action Buttons */}
                                <td className="lg:px-4 pl-2 py-1 lg:py-2 border border-gray-700 text-center">
                                    <button className="mx-1 px-2 py-1 bg-accent-primary hover:bg-transparent rounded">
                                        <i className="fa-solid fa-scale-unbalanced"></i>
                                    </button>
                                    <button className="mx-1 px-2 py-1 bg-blue-600 hover:bg-transparent rounded">
                                        <i className="fa-solid fa-scale-balanced"></i>
                                    </button>
                                    <button className="mx-1 px-2 py-1 bg-green-600 hover:bg-transparent rounded">
                                        <i className="fa-solid fa-scale-unbalanced-flip"></i>
                                    </button>
                                </td>
                                <td className="lg:px-4 pl-1 lg:pl-5 py-1 lg:py-2 border border-gray-700 text-center">
                                    <button className="px-2 py-1 bg-red-600 hover:bg-transparent rounded">
                                        <i className="fa-solid fa-ban"></i>
                                    </button>
                                </td>
                                <td className="lg:px-4 pl-2 py-1 lg:py-2 border border-gray-700 text-center">
                                    <button className="px-2 py-1 bg-orange-700 hover:bg-transparent rounded">
                                        <i className="fa-solid fa-bug-slash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};