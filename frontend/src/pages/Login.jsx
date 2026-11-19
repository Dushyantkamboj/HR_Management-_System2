import { useState } from 'react';
import { UserRound, Users, Calendar, Droplet, CalendarDays, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import DividerHeading from '../components/DividerHeading.jsx';
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { admin_login } from '../api/admin/login.js';
import { useNavigate, Link } from 'react-router-dom';

const delay = (d) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, d * 1000);
    });
};

const Login = () => {
    const [showPassword, setshowPassword] = useState(false);
    const Navigate = useNavigate();

    const handleLogin = async (email, password) => {
        const success = await admin_login(email, password);

        if (success?.value) {
            toast.success("Login Successful", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });

            Navigate('/dashboard');
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        await delay(3);
        handleLogin(data.Email, data.Password);
        console.log('data:', data);
    };

    return (
        <div className="flex min-h-screen w-full bg-[#0F172A]">
            {/* Left Showcase (visible on lg+) */}
            <div className="hidden lg:flex relative flex-col justify-between w-1/2 min-h-screen bg-[url('/panel-background.png')] bg-cover bg-center overflow-hidden p-10 xl:p-14">
                <div className="relative z-10 flex flex-col gap-y-8">
                    <div className="flex items-center gap-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                            <UserRound className="text-[#8FC1FF]" size={20} />
                        </div>
                        <div className="flex items-center gap-1.5 text-xl font-bold font-sans">
                            <span className='text-[#8FC1FF]'>HR</span>
                            <span className='text-white'>Management System</span>
                        </div>
                    </div>

                    <div className='flex flex-col gap-y-4 max-w-lg'>
                        <h1 className='text-white font-bold text-3xl xl:text-4xl leading-tight'>
                            Build a better workplace, <span className='text-[#8FC1FF]'>together</span>
                        </h1>
                        <p className='text-gray-300 text-sm xl:text-base leading-relaxed'>
                            Manage employees, track attendance, handle leave requests, and run operations — all from one dashboard.
                        </p>
                    </div>

                    <div className='flex flex-col gap-3.5'>
                        <div className='flex gap-3 items-center'>
                            <div className="flex items-center justify-center w-9 h-9 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                                <Users className='text-[#8FC1FF]' size={18} />
                            </div>
                            <span className='text-white text-sm font-medium'>Employee management</span>
                        </div>

                        <div className='flex gap-3 items-center'>
                            <div className="flex items-center justify-center w-9 h-9 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                                <Calendar className='text-[#8FC1FF]' size={18} />
                            </div>
                            <span className='text-white text-sm font-medium'>Attendance tracking</span>
                        </div>

                        <div className='flex gap-3 items-center'>
                            <div className="flex items-center justify-center w-9 h-9 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                                <Droplet className='text-[#5FB894]' size={18} />
                            </div>
                            <span className='text-white text-sm font-medium'>Leave management</span>
                        </div>

                        <div className='flex gap-3 items-center'>
                            <div className="flex items-center justify-center w-9 h-9 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                                <CalendarDays className='text-[#8FC1FF]' size={18} />
                            </div>
                            <span className='text-white text-sm font-medium'>Event management</span>
                        </div>
                    </div>
                </div>

                <div className='relative z-0 mt-8'>
                    <img className='max-w-md w-full object-contain drop-shadow-2xl' src="desk-img.png" alt="Workspace Illustration" />
                </div>
            </div>

            {/* Right Login Form */}
            <div className='flex flex-1 justify-center items-center min-h-screen w-full lg:w-1/2 p-4 sm:p-8 md:p-12 bg-white py-10'>
                <div className='w-full max-w-md flex flex-col gap-y-6 sm:gap-y-8'>
                    {/* Mobile brand header */}
                    <div className="flex lg:hidden items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-indigo-50 rounded-xl border border-indigo-100">
                            <UserRound className="text-[#6C63FF]" size={20} />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-gray-900">PeopleCore </span>
                            <span className="text-xl font-bold text-[#6C63FF]">HR</span>
                        </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                        <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Welcome back</h1>
                        <p className='text-gray-500 text-sm'>Login to your Admin account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 sm:gap-5'>
                        {/* Email Input */}
                        <div className='relative flex flex-col'>
                            <div className='absolute left-3.5 top-3.5 text-gray-400 pointer-events-none'>
                                <Mail size={18} />
                            </div>
                            <input
                                className='w-full border border-gray-300 pl-11 pr-4 py-3 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm sm:text-base'
                                {...register("Email", {
                                    required: { value: true, message: "Email is required" },
                                    pattern: { value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/, message: "Enter a valid gmail address" }
                                })}
                                type="email"
                                placeholder='Email address'
                            />
                        </div>
                        {errors.Email && <span className='text-red-500 text-xs sm:text-sm ml-1 -mt-2'>{errors.Email.message}</span>}

                        {/* Password Input */}
                        <div className='relative flex flex-col'>
                            <div className='absolute left-3.5 top-3.5 text-gray-400 pointer-events-none'>
                                <Lock size={18} />
                            </div>
                            <input
                                className='w-full border border-gray-300 pl-11 pr-11 py-3 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm sm:text-base'
                                {...register("Password", {
                                    required: { value: true, message: "Password is required" },
                                    minLength: { value: 8, message: "Min Length is 8" },
                                    maxLength: { value: 20, message: "Max Length is 20" },
                                    pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, message: "Password must contain uppercase, lowercase, number and special character" }
                                })}
                                type={showPassword ? "text" : "password"}
                                placeholder='Password'
                            />
                            <button
                                type="button"
                                onClick={() => setshowPassword(!showPassword)}
                                className='absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer'
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                        {errors.Password && <span className='text-red-500 text-xs sm:text-sm ml-1 -mt-2'>{errors.Password.message}</span>}

                        {/* Remember Me & Forgot Password */}
                        <div className='flex items-center justify-between text-xs sm:text-sm'>
                            <label className='flex gap-2 items-center cursor-pointer'>
                                <input className='w-4 h-4 rounded text-indigo-600 cursor-pointer accent-indigo-600' type="checkbox" />
                                <span className='text-gray-600'>Remember me</span>
                            </label>
                            <Link to='/forgotpassword' className='text-indigo-600 hover:text-indigo-800 font-medium'>
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className='flex w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl justify-center items-center gap-2 cursor-pointer transition shadow-md'
                        >
                            {isSubmitting ? (
                                <span className='animate-spin border-2 rounded-full h-5 w-5 border-white border-t-transparent' />
                            ) : (
                                <>
                                    <span>Login</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div>
                        <DividerHeading text="HR Management System" />
                    </div>

                    <div className='text-center text-xs text-gray-400'>
                        <p>Access is logged and restricted to authorized personnel.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
