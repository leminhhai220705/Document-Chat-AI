import { useState } from "react";
import ChatContext from "./CreateChatContext";
import openAIService from "../services/openaiService";

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]); // Store messages
  const [loading, setLoading] = useState(false); // Loading state
  const [currentDocument, setCurrentDocument] = useState(null); // Current document
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || ''); // API key

  // Initialize OpenAI with API key
  const initializeOpenAI = (key) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
    openAIService.initialize(key);
  };

  // Upload document
  const uploadDocument = (document) => {
    setCurrentDocument(document);
    // Add success upload message
    setMessages(prev => [...prev, {
      text: `✅ Document "${document.metadata.fileName}" uploaded successfully! You can start asking questions about the document.`,
      sender: "system"
    }]);
  };

  // Clear document
  const clearDocument = () => {
    setCurrentDocument(null);
    setMessages(prev => [...prev, {
      text: "🗑️ Document cleared. You can upload a new document.",
      sender: "system"
    }]);
  };

  // Send message
  const sendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: message, sender: "user" }]);
    setLoading(true);

    try {
      let response;
      
      if (currentDocument) {
        // Chat with document
        if (!openAIService.isInitialized()) {
          throw new Error('Please provide OpenAI API key to use document chat feature.');
        }
        response = await openAIService.chatWithDocument(message, currentDocument.text, messages);
      } else {
        // Normal chat
        if (!openAIService.isInitialized()) {
          response = "Hello! To use the chat feature, please provide your OpenAI API key and upload a document.";
        } else {
          response = await openAIService.simpleChat(message, messages);
        }
      }

      // Add AI response
      setMessages(prev => [...prev, { text: response, sender: "ai" }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        text: `❌ Error: ${error.message}`,
        sender: "system"
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Legacy function for compatibility
  const receiveMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: "ai" }]);
  };

  // Provide values and functions to the entire application
  return (
    <ChatContext.Provider value={{ 
      messages, 
      loading, 
      currentDocument,
      apiKey,
      sendMessage, 
      receiveMessage, 
      uploadDocument,
      clearDocument,
      initializeOpenAI
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
