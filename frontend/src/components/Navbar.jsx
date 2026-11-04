import { Search, BellDot } from 'lucide-react'
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';
import Cookies from "js-cookie";

const Navbar = () => {
  const value = useContext(UserContext)
  console.log('value:',value); 

  const name = Cookies.get('name')
  const arr = name.split(" ")

  let n = arr.length;
  let str = arr[0].charAt(0) + arr[n - 1].charAt(0)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <div className='ml-10'>
        <h1 className="font-semibold text-2xl">{value.current}</h1>
        <p className="text-[#6B6D8A]">{today}</p>
      </div>
      <div className='flex gap-3 items-center mr-10'>
        <div className='relative flex items-center'>
          <Search className='absolute left-2 text-gray-400' size={15} />
          <input className='border w-50 bg-gray-100 border-gray-100 rounded-xl text-gray-400 py-2 px-8 focus:outline-none placeholder:text-gray-400' type="text" placeholder='Search....' />
        </div>
        <div className='relative flex justify-center items-center ring h-10 w-10 rounded-lg ring-gray-100 bg-gray-100'>
          <BellDot className='text-gray-600' />
          <span className="absolute top-3 right-3 flex size-2 -translate-y-1/3 translate-x-1/3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-600 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-red-600"></span>
          </span>
        </div>
        <div className='flex justify-center items-center text-white font-semibold text-md ring ring-transparent ring-[linear-gradient(white,white)_padding-box,linear-gradient(135deg,rgb(247,149,79)_0%,rgb(247,79,126)_100%)_border-box] rounded-full h-10 w-10 bg-[linear-gradient(135deg,rgb(247,149,79)_0%,rgb(247,79,126)_100%)]'>
          {str}
        </div>
      </div>
    </>
  )
}

export default Navbar
