import { useState } from 'react';
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Search } from 'lucide-react';

const App = () => {
    const [username, setUsername] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');

    const validateTwitterUsername = (username) => {
        const pattern = /^[A-Za-z0-9_]{1,15}$/;
        return pattern.test(username);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateTwitterUsername(username)) {
            setError('Please enter a valid Twitter username');
            return;
        }

        setError('');
        setIsModalOpen(true);

        // Placeholder for background process
        await new Promise(resolve => setTimeout(resolve, 5000));
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
            <Navbar />

            <main className="flex-grow px-6 py-12 bg-black bg-opacity-25">
                <h2 className="text-2xl lg:text-4xl font-bold text-center mb-16 bg-gradient-to-br from-gray-300 to-gray-200 bg-clip-text text-transparent font-ocr tracking-tight">
                    Crypto and Web3 Watchdog
                </h2>
                <h3 className="text-md lg:text-lg font-bold text-center mb-4 bg-gradient-to-br from-gray-300 to-gray-200 bg-clip-text text-transparent font-ocr tracking-tight">
                    Enter Twitter/X username below to index the individual
                </h3>
                <div className="max-w-xl mx-auto h-6 lg:mt-1 mb-16">
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter Twitter/X @"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-green-500 text-gray-100"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-green-600 border border-green-600 hover:bg-transparent rounded-r-lg transition-colors"
                            >
                                <Search className="w-6 h-6" />
                            </button>
                        </div>
                        {error && (
                            <p className="absolute -bottom-6 left-0 text-red-500 text-sm">{error}</p>
                        )}
                    </form>
                </div>
            </main>

            <footer className="text-center">
                <Footer />
            </footer>

            {/* Loading Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-xl items-center justify-center flex flex-col">
                        <img src="./assets/logo-light.png" width="100" className="transition-transform logo-rotate-fast items-center" alt="DOCAL Loader" />
                        <p className="text-center mt-4 text-gray-300 font-ocr text-xl tracking-tight">Beep Boop</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;