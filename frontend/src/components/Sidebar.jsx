import { NavLink } from "react-router-dom"
import { Users, LayoutGrid, UserRound, CalendarCheck, MapPin, Calendar, Star, Settings, LogOut } from 'lucide-react';
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const Sidebar = () => {
  const value = useContext(UserContext)
  console.log('value:',value);
  
  const Navigate = useNavigate()

  const name = Cookies.get('name')
  const type = parseInt(Cookies.get('type'))  
  
  const handleClick =() => {
    Cookies.remove('accessToken')

    setTimeout(() => {
        Navigate('/login')
    }, 1000);

    toast.success('Logout successful!', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  const arr = name.split(" ")

  let n = arr.length
  let str = arr[0].charAt(0) + arr[n - 1].charAt(0)

  return (
    <div className='relative z-70'>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="border border-x-0 border-white/10 w-full h-20 flex pt-5">
        <div className='flex justify-center items-center border rounded-xl w-10 h-10 bg-[rgb(108,99,255)] text-white border-[rgb(108,99,255)] shrink-0 ml-5'>
          <Users size={20} />
        </div>
        <div className='flex flex-col gap-1 ml-2'>
          <h1 className='font-bold text-white leading-tight'>PeopleCore</h1>
          <p className='text-[#9ca3af] text-xs font-bold'>HR Management</p>
        </div>
      </div>
      <div className='ml-5 mt-6'>
        <h1 className='text-[#9ca3af] font-bold text-xs uppercase'>main menu</h1>
      </div>
      <div className='flex flex-col gap-3 ml-5 mt-6'>
        {type!==3 &&
        <NavLink to='/dashboard'>
          {({ isActive }) => (
            <button onClick={() => value.setCurrent("Dashboard")} className={`flex  items-center gap-2 pl-3  py-2 w-60 hover:cursor-pointer focus:outline-none ${isActive ? "border border-[1px]  border-solid border-[rgba(79,142,247,0.25)] bg-[linear-gradient(90deg,rgba(79,142,247,0.22)_0%,rgba(108,99,255,0.12)_100%)]  rounded-xl" : "transparent"}`}><span className={`hover:text-[#D4D7DD] shrink-0 ${isActive ? "text-[#7eb8fb]" : "text-[#9ca3af]"}`}><LayoutGrid size={20} /></span><span className={`font-semibold font-sans text-md hover:text-[#D4D7DD] ${isActive ? "text-[#7eb8fb]" : "text-[#9ca3af]"}`}>Dashboard</span></button>
          )}
        </NavLink>
         }
         {type!==3 && 
        <NavLink to='/employee'>
          {({ isActive }) => (
            <button onClick={() => value.setCurrent("Employee")} className={`flex items-center  gap-2 pl-3 py-2 w-60 hover:cursor-pointer focus:outline-none  ${isActive ? "border border-[1px]  border-solid border-[rgba(79,142,247,0.25)]  bg-[linear-gradient(90deg,rgba(79,142,247,0.22)_0%,rgba(108,99,255,0.12)_100%)]  rounded-xl" : "transparent"} `}><span className={`hover:text-[#D4D7DD] ${isActive ? "text-[#7eb8fb]" : "text-[#9ca3af]"}`}><UserRound size={20} /></span><span className={`font-semibold font-sans text-md hover:text-[#D4D7DD] ${isActive ? "text-[#7eb8fb]" : "text-[#9ca3af]"}`}>Employee</span></button>
          )}
        </NavLink>
        }
        <NavLink to='/attendance'>
          {({ isActive }) => (
            <button onClick={() => value.setCurrent("Attendance")} className={`flex items-center  gap-2 pl-3 py-2 w-60 hover:cursor-pointer focus:outline-none  ${isActive ? "border border-[1px]  border-solid border-[rgba(79,142,247,0.25)]  bg-[linear-gradient(90deg,rgba(79,142,247,0.22)_0%,rgba(108,99,255,0.12)_100%)]  rounded-xl" : "transparent"}`}><span className={`hover:text-[#D4D7DD] ${isActive ? "text-[#7eb8fb]" : "text-[#9ca3af]"}`}><CalendarCheck size={20} /></span><span className={`font-semibold font-sans text-md hover:text-[#D4D7DD] ${isActive ? "text-[#7eb8fb]" : "text-[#9ca3af]"}`}>Attendance</span></button>
          )}
        </NavLink>
        <NavLink to='/leaves'>
          {({ isActive }) => (
            <button onClick={() => value.setCurrent("Leaves")} className={`flex items-center  gap-2 pl-3 py-2 w-60 hover:cursor-pointer focus:outline-none  ${isActive ? "border border-[1px]  border-solid border-[rgba(79,142,247,0.25)]  bg-[linear-gradient(90deg,rgba(79,142,247,0.22)_0%,rgba(108,99,255,0.12)_100%)]  rounded-xl" : "transparent"}`}><span className={`hover:text-[#D4D7DD] ${isActive ? "text-[#7eb8fb]" : "text-[#9ca3af]"}`}><MapPin size={20} /></span><span className={`font-semibold font-sans text-md hover:text-[#D4D7DD] ${isActive ? "text-[#7eb8fb]" : "text-[#9ca3af]"}`}>Leaves</span></button>
          )}
        </NavLink>
        <NavLink to='/events'>
          {({ isActive }) => (
            <button onClick={() => value.setCurrent("Events")} className={`flex items-center  gap-2 pl-3 py-2 w-60 hover:cursor-pointer focus:outline-none  ${isActive ? "border border-[1px]  border-solid border-[rgba(79,142,247,0.25)]  bg-[linear-gradient(90deg,rgba(79,142,247,0.22)_0%,rgba(108,99,255,0.12)_100%)]  rounded-xl" : "transparent"}`}><span className={`hover:text-[#D4D7DD] ${isActive ? "text-[#7eb8fb]" : "text-[#9ca3af]"}`}><Calendar size={20} /></span><span className={`font-semibold font-sans text-md hover:text-[#D4D7DD] ${isActive ? "text-[#7eb8fb]" : "text-[#9ca3af]"}`}>Events</span></button>
          )}
        </NavLink>
        {type===1 &&
        <NavLink to='/role&permissions'>
          {({ isActive }) => (
            <button onClick={() => value.setCurrent("Role & Permissions")} className={`flex items-center  gap-2 pl-3 py-2 w-60 hover:cursor-pointer focus:outline-none  ${isActive ? "border border-[1px]  border-solid border-[rgba(79,142,247,0.25)]  bg-[linear-gradient(90deg,rgba(79,142,247,0.22)_0%,rgba(108,99,255,0.12)_100%)]  rounded-xl" : "transparent"}`}><span className={`hover:text-[#D4D7DD] ${isActive ? "text-[#7eb8fb]" : "text-[#9ca3af]"}`}><Star size={20} /></span><span className={`font-semibold font-sans text-md hover:text-[#D4D7DD] ${isActive ? "text-[#7eb8fb]" : "text-[#9ca3af]"}`}>Role & Permissions</span></button>
          )}
        </NavLink>
         }
        <NavLink to='/myprofile'>
          {({ isActive }) => (
            <button onClick={() => value.setCurrent("My Profile")} className={`flex items-center  gap-2 pl-3 py-2 w-60 hover:cursor-pointer focus:outline-none  ${isActive ? "border border-[1px]  border-solid border-[rgba(79,142,247,0.25)]  bg-[linear-gradient(90deg,rgba(79,142,247,0.22)_0%,rgba(108,99,255,0.12)_100%)]  rounded-xl" : "transparent"}`}><span className={`hover:text-[#D4D7DD] ${isActive ? "text-[#7eb8fb]" : "text-[#9ca3af]"}`}><Settings size={20} /></span><span className={`font-medium  font-sans text-md hover:text-[#D4D7DD] ${isActive ? "text-[#7eb8fb]" : "text-[#9ca3af]"}`}>My Profile</span></button>
          )}
        </NavLink>
      </div>
      <div className='fixed w-full h-20 bottom-0 border border-x-0 border-white/10 flex items-center gap-2 ml-5 '>
        <div className='flex justify-center items-center text-white font-semibold text-md ring ring-transparent ring-[linear-gradient(white,white)_padding-box,linear-gradient(135deg,rgb(247,149,79)_0%,rgb(247,79,126)_100%)_border-box] rounded-full h-12 w-12 bg-[linear-gradient(135deg,rgb(247,149,79)_0%,rgb(247,79,126)_100%)]'>
          {str}
          <span className="relative flex size-2 top-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-600 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-green-600"></span>
          </span>
        </div>
        <div className="flex flex-col gap-0">
          <h1 className="text-white font-sans">{name}</h1>
          <p className="text-[#9ca3af] text-sm">{type === "1" ? "Admin" : type === "2" ? "HR" : type === "3" ? "Emoloyee" : " "}</p>
        </div>
        <button className="ml-9 pt-3" onClick={() => handleClick()}><LogOut className="text-[#9ca3af] hover:text-[#D4D7DD]" size={15} /></button>
      </div>
    </div>
  )
}

export default Sidebar;
