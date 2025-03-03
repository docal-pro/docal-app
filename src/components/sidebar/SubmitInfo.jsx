import { useState, useEffect } from 'react';
import { Dropdown } from '../utils/Dropdown';
import { scamClassifiers } from '../../utils/utils';
import { Search } from 'lucide-react';

export const SubmitInfo = () => {
    const [mode, setMode] = useState('Tweeter'); // 'Tweeter' or 'Tweet'
    const [input, setInput] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [searchAttempted, setSearchAttempted] = useState(false);

    const validateTwitterUsername = (username) => /^[A-Za-z0-9_]{1,15}$/.test(username);
    const validateTweetLink = (link) => /^https:\/\/(x|twitter)\.com\/[A-Za-z0-9_]{1,15}\/status\/\d+$/.test(link);

    const handleSubmit = (e) => e.preventDefault();

    const handleSearch = async () => {
        setSearchAttempted(true);

        if (mode === 'Tweeter' && !validateTwitterUsername(input)) {
            setError('Please enter a valid Twitter username');
            return;
        }

        if (mode === 'Tweet' && !validateTweetLink(input)) {
            setError('Please enter a valid tweet link');
            return;
        }

        setError('');
        setIsModalOpen(true);

        await new Promise(resolve => setTimeout(resolve, 5000));
        setIsModalOpen(false);
        setSearchAttempted(false);
    };

    const toggleMode = () => {
        setMode(mode === 'Tweeter' ? 'Tweet' : 'Tweeter');
        setInput('');
        setError('');
    };

    return (
        <div className='w-full md:mt-12 lg:mt-12'>
            <div className="flex flex-col justify-center items-center my-4 gap-4">
                <div className="font-ocr flex items-center space-x-3 text-gray-400 text-xl tracking-tight">
                    {`Not implemented yet!`}
                </div>
            </div>

            <h3 className="text-md lg:text-lg font-bold text-center mb-4 bg-gradient-to-br from-gray-300 to-gray-200 bg-clip-text text-transparent font-ocr tracking-tight">
            </h3>

            <div className="max-w-xl mx-auto h-6 lg:mt-1 mb-16">
            </div>
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