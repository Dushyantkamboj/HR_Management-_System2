import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Layout = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(UserContext);

  return (
    // No overflow-x-hidden here: it creates a scroll container that breaks
    // the sticky navbar. Horizontal clipping is handled by <main> and .table-shell.
    <div className="min-h-screen bg-[#f5f6fa] flex">

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar (drawer on mobile / fixed on lg+) */}
      <aside
        className={`fixed z-50 left-0 top-0 w-64 lg:w-70 h-screen border-r border-white/10 bg-[linear-gradient(180deg,#1a2744_0%,#1e2f52_60%,#1a2744_100%)] transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-70 min-h-screen">

        {/* Navbar */}
        <header className="sticky z-30 top-0 h-16 sm:h-20 border-b border-gray-200/80 backdrop-blur-2xl shadow-sm bg-white/95 px-4 sm:px-6 flex items-center justify-between">
          <Navbar />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f5f6fa] p-3 sm:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default Layout;

