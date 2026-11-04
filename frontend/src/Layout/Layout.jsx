import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'


const Layout = () => {
  return (
    <div className="w-screen h-screen overflow-hidden">

      {/* Sidebar */}
      <aside className="fixed z-60 left-0 top-0 w-70 h-screen border-r bg-[linear-gradient(180deg,#1a2744_0%,#1e2f52_60%,#1a2744_100%)]">
        <Sidebar />
      </aside>

      {/* Right Side */}
      <div className="ml-70 h-screen">

        {/* Navbar */}
        <header className="sticky z-50 top-0 h-20 border-b border-white/80 backdrop-blur-2xl shadow-md  bg-white flex items-center justify-between ">
          <Navbar />
        </header>

        {/* Main Content */}
        <main className="h-[calc(100vh-80px)] overflow-y-auto p-6 bg-[#f5f6fa]">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default Layout;
