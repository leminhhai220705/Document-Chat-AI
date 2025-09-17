import { HashRouter, Routes, Route } from "react-router-dom";
import ChatProvider from "./context/ChatProvider";
import MainLayout from "./layouts/MainLayout";
import ChatPage from "./pages/ChatPage";

const App = () => {
  return (
    <ChatProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<ChatPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ChatProvider>
  );
};

export default App;
