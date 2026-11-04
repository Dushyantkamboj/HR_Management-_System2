import { useState } from 'react';
import { UserRound, Users, Calendar, Droplet, CalendarDays, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import DividerHeading from '../components/DividerHeading.jsx'
import { useForm } from "react-hook-form"
import { toast } from "react-toastify";
import { employee_login } from '../api/user/userLogin.js';
import { useNavigate } from 'react-router-dom';

const delay = (d) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, d * 1000);
    })
}

const EmployeeLogin = () => {
    const [showPassword, setshowPassword] = useState(false)
    const Navigate = useNavigate()

    const handleLogin = async (email, password) => {
        const success = await employee_login(email, password);

        if (success?.value) {

            toast.success("Login Successful", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            Navigate('/attendance')
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm()

    const onSubmit = async (data) => {
        await delay(3);
        handleLogin(data.Email, data.Password)
        
        console.log('data:', data)
    }

    return (
        <div className="flex w-screen h-screen">
            <div className="relative flex flex-col gap-y-8 h-full w-1/2 bg-[url('/panel-background.png')] bg-cover bg-center overflow-hidden px-10">
                <div className="flex items-center gap-x-2 ml-10 mt-10">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-200/10 backdrop-blur-2xl rounded-lg border border-gray-200/10">
                        <UserRound className="text-[#8FC1FF]" size={15} />
                    </div>
                    <h1 className='text-[#8FC1FF] font-semibold font-sans text-xl '>HR</h1>
                    <h1 className='text-white font-semibold font-sans text-xl'>Management System</h1>
                </div>
                <div className='flex  flex-col gap-y-5 ml-10'>
                    <h1 className='text-white font-bold text-4xl max-w-70'>Build a better workplace,<span className='text-[#8FC1FF] font-bold  text-4xl'>together</span></h1>
                    <p className='text-gray-400 max-w-79'>Manage employees, track attendance, handle leave requests, and run payroll -- all from one dashboard.</p>
                </div>
                <div className='flex flex-col gap-4 ml-10'>
                    <div className='flex gap-2 items-center'>
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-200/10 backdrop-blur-2xl rounded-lg border border-gray-200/10">
                            <Users className='text-[#8FC1FF]' size={20} />
                        </div>
                        <h1 className='text-white'>Employee management</h1>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-200/10 backdrop-blur-2xl rounded-lg border border-gray-200/10">
                            <Calendar className='text-[#8FC1FF]' size={20} />
                        </div>
                        <h1 className='text-white'>Attendance tracking</h1>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-200/10 backdrop-blur-2xl rounded-lg border border-gray-200/10">
                            <Droplet className='text-[#5FB894]' size={20} />
                        </div>
                        <h1 className='text-white'>Leave management</h1>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-200/10 backdrop-blur-2xl rounded-lg border border-gray-200/10">
                            <CalendarDays className='text-[#8FC1FF]' />
                        </div>
                        <h1 className='text-white'>Event management</h1>
                    </div>
                </div>
                <div className='ml-5'>
                    <img className='absolute bottom-0 w-150' src="desk-img.png" alt="" />
                </div>
            </div>
            <div className='flex justify-center items-center h-full w-1/2'>
                <div className='flex flex-col min-w-105 gap-y-8'>
                    <div className='flex flex-col gap-2'>
                        <h1 className='font-sans text-3xl font-bold'>Welcome back</h1>
                        <p className='text-gray-400'>Login to your HR Management System account</p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                            <div className='relative flex flex-col'>
                                <div className='absolute bottom-3 px-3 mb-0.5 text-gray-400 hover:cursor-pointer'>
                                    <Mail size={18} />
                                </div>
                                <input className='border w-100 type:px-3 border-gray-400 pl-10  py-3 rounded-lg placeholder:pl-2 placeholder:text-gray-400 focus:outline-none hover:cursor-pointer' {...register("Email", { required: { value: true, message: "Email is required" }, pattern: { value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/, message: "Enter the correct email" } })} type="email" placeholder='Email address' />
                            </div>
                            {errors.Email && <span className='text-red-500 -mt-[20px] ml-2 '>{errors.Email.message}</span>}
                            <div className='relative flex flex-col'>
                                <div className='absolute bottom-3 px-3 mb-0.5 text-gray-400 hover:cursor-pointer'>
                                    <Lock size={18} />
                                </div>
                                <input className='border w-100 border-gray-400 pl-10 py-3 rounded-lg placeholder:pl-2 placeholder:text-gray-400 focus:outline-none hover:cursor-pointer' {...register("Password", { required: { value: true, message: "password is required" }, minLength: { value: 8, message: "Min Length is 8" }, maxLength: { value: 20, message: "Max Length is 20" }, pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, message: "Password must contain uppercase, lowercase, number and special character" } })} type={showPassword ? "text" : "password"} placeholder='Password' />

                                <button onClick={() => setshowPassword(!showPassword)} className='absolute right-8 bottom-3 text-gray-400 hover:cursor-pointer'>{showPassword ? <Eye size={20} /> : <EyeOff size={20} />}</button>
                            </div>
                            {errors.Password && <span className='text-red-500 ml-2 -mt-[20px] w-[400px]'>{errors.Password.message}</span>}
                            <div className='flex gap-40'>
                                <div className='flex gap-2 items-center justify-center'>
                                    <input className='w-4 h-4 hover:cursor-pointer' type="checkbox" />
                                    <p className='text-gray-400'>Remember me</p>
                                </div>
                                <p className='text-indigo-600 hover:cursor-pointer'>Forgot password?</p>
                            </div>
                            <div>
                                <button onClick={handleSubmit(onSubmit)} className='flex border w-105 bg-slate-800 hover:bg-[#0D1626] text-white font-semibold font-sans py-3 rounded-lg  justify-center items-center gap-2 hover:cursor-pointer' >
                                    {isSubmitting ? (
                                        <>
                                            <span className='animate-spin border rounded-full h-5 w-5  border-white border-t-transparent '></span>
                                        </>
                                    ) : (
                                        <>
                                            Login <ArrowRight size={15} />
                                        </>
                                    )
                                    }
                                </button>
                            </div>
                        </form>
                    </div>

                    <div>
                        <DividerHeading text="HR Management System" />
                    </div>
                    <div className=''>
                        <p className='text-gray-400'>Access is logged and restricted to authorized personnel.</p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EmployeeLogin;
