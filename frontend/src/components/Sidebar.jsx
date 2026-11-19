import { NavLink } from "react-router-dom";
import { Users, LayoutGrid, UserRound, CalendarCheck, MapPin, Calendar, Star, Settings, LogOut, X } from 'lucide-react';
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Sidebar = () => {
  const value = useContext(UserContext);
  const Navigate = useNavigate();

  const name = Cookies.get('name') || "User";
  const type = parseInt(Cookies.get('type'));

  const handleClick = () => {
    Cookies.remove('accessToken');

    setTimeout(() => {
      Navigate('/login');
    }, 1000);

    toast.success('Logout successful!', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  const arr = name.trim().split(/\s+/);
  const str = arr.length > 1
    ? arr[0].charAt(0) + arr[arr.length - 1].charAt(0)
    : (arr[0]?.charAt(0) || "U");

  const handleNavClick = (pageName) => {
    value.setCurrent(pageName);
    value.setIsSidebarOpen?.(false);
  };

  return (
    <div className='relative h-full flex flex-col justify-between text-white'>
      {/* Top Section */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Brand Header */}
        <div className="border-b border-white/10 w-full h-16 sm:h-20 flex items-center justify-between px-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className='flex justify-center items-center border rounded-xl w-10 h-10 bg-[rgb(108,99,255)] text-white border-[rgb(108,99,255)] shrink-0'>
              <Users size={20} />
            </div>
            <div className='flex flex-col'>
              <h1 className='font-bold text-white text-base leading-tight'>PeopleCore</h1>
              <p className='text-[#9ca3af] text-xs font-semibold'>HR Management</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={() => value.setIsSidebarOpen?.(false)}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Section Label */}
        <div className='px-5 mt-6 mb-3'>
          <h2 className='text-[#9ca3af] font-bold text-xs uppercase tracking-wider'>main menu</h2>
        </div>

        {/* Nav Links */}
        <nav className='flex flex-col gap-1.5 px-3'>
          {type !== 3 && (
            <NavLink to='/dashboard'>
              {({ isActive }) => (
                <button
                  onClick={() => handleNavClick("Dashboard")}
                  className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition font-medium text-sm text-left ${
                    isActive
                      ? "border border-[rgba(79,142,247,0.3)] bg-[linear-gradient(90deg,rgba(79,142,247,0.22)_0%,rgba(108,99,255,0.12)_100%)] text-[#7eb8fb]"
                      : "text-[#9ca3af] hover:text-[#D4D7DD] hover:bg-white/5"
                  }`}
                >
                  <span className="shrink-0"><LayoutGrid size={18} /></span>
                  <span>Dashboard</span>
                </button>
              )}
            </NavLink>
          )}

          {type !== 3 && (
            <NavLink to='/employee'>
              {({ isActive }) => (
                <button
                  onClick={() => handleNavClick("Employee")}
                  className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition font-medium text-sm text-left ${
                    isActive
                      ? "border border-[rgba(79,142,247,0.3)] bg-[linear-gradient(90deg,rgba(79,142,247,0.22)_0%,rgba(108,99,255,0.12)_100%)] text-[#7eb8fb]"
                      : "text-[#9ca3af] hover:text-[#D4D7DD] hover:bg-white/5"
                  }`}
                >
                  <span className="shrink-0"><UserRound size={18} /></span>
                  <span>Employee</span>
                </button>
              )}
            </NavLink>
          )}

          <NavLink to='/attendance'>
            {({ isActive }) => (
              <button
                onClick={() => handleNavClick("Attendance")}
                className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition font-medium text-sm text-left ${
                  isActive
                    ? "border border-[rgba(79,142,247,0.3)] bg-[linear-gradient(90deg,rgba(79,142,247,0.22)_0%,rgba(108,99,255,0.12)_100%)] text-[#7eb8fb]"
                    : "text-[#9ca3af] hover:text-[#D4D7DD] hover:bg-white/5"
                }`}
              >
                <span className="shrink-0"><CalendarCheck size={18} /></span>
                <span>Attendance</span>
              </button>
            )}
          </NavLink>

          <NavLink to='/leaves'>
            {({ isActive }) => (
              <button
                onClick={() => handleNavClick("Leaves")}
                className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition font-medium text-sm text-left ${
                  isActive
                    ? "border border-[rgba(79,142,247,0.3)] bg-[linear-gradient(90deg,rgba(79,142,247,0.22)_0%,rgba(108,99,255,0.12)_100%)] text-[#7eb8fb]"
                    : "text-[#9ca3af] hover:text-[#D4D7DD] hover:bg-white/5"
                }`}
              >
                <span className="shrink-0"><MapPin size={18} /></span>
                <span>Leaves</span>
              </button>
            )}
          </NavLink>

          <NavLink to='/events'>
            {({ isActive }) => (
              <button
                onClick={() => handleNavClick("Events")}
                className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition font-medium text-sm text-left ${
                  isActive
                    ? "border border-[rgba(79,142,247,0.3)] bg-[linear-gradient(90deg,rgba(79,142,247,0.22)_0%,rgba(108,99,255,0.12)_100%)] text-[#7eb8fb]"
                    : "text-[#9ca3af] hover:text-[#D4D7DD] hover:bg-white/5"
                }`}
              >
                <span className="shrink-0"><Calendar size={18} /></span>
                <span>Events</span>
              </button>
            )}
          </NavLink>

          {type === 1 && (
            <NavLink to='/role&permissions'>
              {({ isActive }) => (
                <button
                  onClick={() => handleNavClick("Role & Permissions")}
                  className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition font-medium text-sm text-left ${
                    isActive
                      ? "border border-[rgba(79,142,247,0.3)] bg-[linear-gradient(90deg,rgba(79,142,247,0.22)_0%,rgba(108,99,255,0.12)_100%)] text-[#7eb8fb]"
                      : "text-[#9ca3af] hover:text-[#D4D7DD] hover:bg-white/5"
                  }`}
                >
                  <span className="shrink-0"><Star size={18} /></span>
                  <span>Role & Permissions</span>
                </button>
              )}
            </NavLink>
          )}

          <NavLink to='/myprofile'>
            {({ isActive }) => (
              <button
                onClick={() => handleNavClick("My Profile")}
                className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition font-medium text-sm text-left ${
                  isActive
                    ? "border border-[rgba(79,142,247,0.3)] bg-[linear-gradient(90deg,rgba(79,142,247,0.22)_0%,rgba(108,99,255,0.12)_100%)] text-[#7eb8fb]"
                    : "text-[#9ca3af] hover:text-[#D4D7DD] hover:bg-white/5"
                }`}
              >
                <span className="shrink-0"><Settings size={18} /></span>
                <span>My Profile</span>
              </button>
            )}
          </NavLink>
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className='absolute bottom-0 left-0 right-0 h-20 border-t border-white/10 flex items-center justify-between px-4 bg-[#1a2744]/95'>
        <div className="flex items-center gap-3 min-w-0">
          <div className='relative flex justify-center items-center text-white font-semibold text-sm rounded-full h-10 w-10 shrink-0 bg-[linear-gradient(135deg,rgb(247,149,79)_0%,rgb(247,79,126)_100%)] shadow-sm'>
            {str.toUpperCase()}
            <span className="absolute bottom-0 right-0 flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex size-2.5 rounded-full bg-green-500 ring-2 ring-[#1a2744]"></span>
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className="text-white font-medium text-sm truncate">{name}</h3>
            <p className="text-[#9ca3af] text-xs">
              {type === 1 ? "Admin" : type === 2 ? "HR" : type === 3 ? "Employee" : "Staff"}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="p-2 text-[#9ca3af] hover:text-white hover:bg-white/10 rounded-lg transition shrink-0 ml-2"
          onClick={handleClick}
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
