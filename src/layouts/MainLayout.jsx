import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
