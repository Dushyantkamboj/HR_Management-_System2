import { Search, BellDot, Menu } from 'lucide-react'
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';
import Cookies from "js-cookie";

const Navbar = () => {
  const value = useContext(UserContext);

  const name = Cookies.get('name') || "User";
  const arr = name.trim().split(/\s+/);

  let n = arr.length;
  let str = n > 1 
    ? arr[0].charAt(0) + arr[n - 1].charAt(0)
    : (arr[0]?.charAt(0) || "U");

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full flex items-center justify-between">
      {/* Left: Mobile Menu Toggle + Title */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => value.setIsSidebarOpen?.(!value.isSidebarOpen)}
          className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate font-semibold text-lg sm:text-2xl text-gray-900 leading-tight">
            {value.current}
          </h1>
          <p className="text-[#6B6D8A] text-xs sm:text-sm hidden sm:block">
            {today}
          </p>
        </div>
      </div>

      {/* Right: Search, Notifications, Avatar */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 text-gray-400" size={16} />
          <input
            className="border w-40 lg:w-56 bg-gray-100 border-gray-100 rounded-xl text-gray-700 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-gray-400"
            type="text"
            placeholder="Search..."
          />
        </div>

        <div className="relative flex justify-center items-center h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer transition">
          <BellDot size={18} />
          <span className="absolute top-2.5 right-2.5 flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-red-600"></span>
          </span>
        </div>

        <div className="flex justify-center items-center text-white font-semibold text-sm sm:text-base rounded-full h-9 w-9 sm:h-10 sm:w-10 bg-[linear-gradient(135deg,rgb(247,149,79)_0%,rgb(247,79,126)_100%)] shadow-sm shrink-0">
          {str.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

