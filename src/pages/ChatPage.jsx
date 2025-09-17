import ChatWindow from '../components/ChatWindow';
import DocumentView from '../components/DocumentView';
import ApiKeyModal from '../components/ApiKeyModal';

const ChatPage = () => {
  return (
    <>
      <ApiKeyModal />
      <div className="flex h-full">
        <div className="flex-1">
          <ChatWindow />
        </div>
        <div className="w-1/3 border-l border-gray-200">
          <DocumentView />
        </div>
      </div>
    </>
  );
};

export default ChatPage;