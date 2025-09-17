import { useContext, useState } from 'react';
import ChatContext from '../context/CreateChatContext';
import FileUpload from './FileUpload';

const Sidebar = () => {
  const { apiKey, initializeOpenAI } = useContext(ChatContext);
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const [tempApiKey, setTempApiKey] = useState('');

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    if (tempApiKey.trim()) {
      initializeOpenAI(tempApiKey.trim());
      setShowApiKeyInput(false);
      setTempApiKey('');
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Document Chat AI</h1>
        <p className="text-sm text-gray-600 mt-1">Upload and chat with documents</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* API Key Section */}
        <div className="p-4 border-b border-gray-200">
          {showApiKeyInput ? (
            <form onSubmit={handleApiKeySubmit} className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                OpenAI API Key:
              </label>
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700"
              >
                Save API Key
              </button>
            </form>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">API Key:</span>
                <span className="text-xs text-green-600">✓ Configured</span>
              </div>
              <button
                onClick={() => setShowApiKeyInput(true)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {/* File Upload Section */}
        <div className="p-4">
          <FileUpload />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;