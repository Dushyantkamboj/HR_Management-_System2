import { CalendarDays, X, Info, LogIn, LogOut } from 'lucide-react';
import { motion } from "framer-motion";
import { useState } from "react";
import Cookies from 'js-cookie';
import { add_attendance } from '../api/attendance/addAttendance.js'

// Today's date as "YYYY-MM-DD" (local time)
const getToday = () => new Date().toLocaleDateString("en-CA");

const AddAttendance = ({ Close, getAttendance }) => {

    const [date, setDate] = useState(getToday());
    const [loading, setLoading] = useState(false);

    // Common function to send attendance to the API
    const sendAttendance = async (attendanceType) => {
        if (!date) return;

        try {
            setLoading(true);

            // Employee ID is taken automatically (not typed by the user).
            // Change 'employeeId' to the cookie name your login actually sets.
            const employeeId = Cookies.get('employeeId');

            const response = await add_attendance({
                date,
                attendance_type: attendanceType,
                ...(employeeId && { employeeId }),
            });

            console.log("Add attendance response:", response);

            if (response?.data?.status === 1) {
                if (getAttendance) getAttendance();
                Close();
            }

        } catch (error) {
            console.log("Add attendance error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Check In: attendance_type = 1
    const handleCheckIn = () => sendAttendance(1);

    // Check Out: attendance_type = 2
    const handleCheckOut = () => sendAttendance(2);

    return (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex justify-center items-center">

            <motion.div
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, ease: "linear" }}
                className="border min-w-150 min-h-80 bg-[#FFFFFF] border-[#FFFFFF] rounded-xl flex flex-col gap-5"
            >

                {/* Header */}
                <div className="sticky z-20 flex justify-between items-center border-b border-[#E5E7EB] w-full h-20">

                    <div className='flex justify-center items-center gap-2 ml-5'>

                        <div className='border h-10 w-10 bg-[linear-gradient(135deg,rgb(79,142,247),rgb(108,99,255))] rounded-xl border-[#6C63FF] flex justify-center items-center'>
                            <CalendarDays style={{ width: 20, height: 20, color: "white" }} />
                        </div>

                        <div>
                            <h1 className='text-[#0F172A] font-semibold text-xl'>
                                Add Attendance
                            </h1>
                            <p className='text-sm text-[#94A3B8]'>
                                Mark your attendance
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={() => Close()}
                        className='border h-10 w-10 flex justify-center items-center rounded-xl bg-[#F8FAFC] border-[#E8EDF5] mr-5'
                    >
                        <X className='text-[#64748B]' size={20} />
                    </button>

                </div>

                {/* Body */}
                <div className='w-full flex flex-col gap-5'>

                    {/* Date */}
                    <div className='w-full flex flex-col pl-5 pr-5'>
                        <label className='text-sm text-[#475569] font-medium'>
                            Date *
                        </label>
                        <input
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className='w-full border bg-[#F8FAFC] border-[#E2E8F0] py-2 pl-2 text-sm rounded-lg focus:outline-none'
                            type="date"
                            required
                        />
                    </div>

                    {/* Info */}
                    <div className='w-full'>
                        <div className='relative min-w-120 h-10 ml-5 mr-5 border bg-[#F8FAFC] border-[#E2E8F0] flex items-center gap-2 rounded-lg'>

                            <div className='absolute ml-2 top-2.1'>
                                <Info style={{ width: "15px", height: "15px", color: "#4F8EF7" }} />
                            </div>

                            <p className='ml-8 text-[#9CA3AF] text-sm'>
                                Check In when you arrive and Check Out when you leave.
                            </p>

                        </div>
                    </div>

                    {/* Buttons */}
                    <div className='w-full border-t border-[#E5E7EB] pl-5 pr-5'>

                        <div className='w-full flex justify-between items-center mt-6 mb-5'>

                            <p className='text-sm text-[#6B7280]'>
                                *Required fields
                            </p>

                            <div className='flex gap-5'>

                                <button
                                    type="button"
                                    onClick={() => Close()}
                                    className='border border-[#9CA3AF] px-2 py-2 rounded-lg text-[#6B7280]'
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCheckIn}
                                    disabled={loading}
                                    className='flex items-center justify-center gap-2 border rounded-lg bg-[#16A34A] border-[#16A34A] text-white px-3 py-2 font-semibold disabled:opacity-60 disabled:cursor-not-allowed'
                                >
                                    <LogIn size={18} />
                                    Check In
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCheckOut}
                                    disabled={loading}
                                    className='flex items-center justify-center gap-2 border rounded-lg bg-[#DC2626] border-[#DC2626] text-white px-3 py-2 font-semibold disabled:opacity-60 disabled:cursor-not-allowed'
                                >
                                    <LogOut size={18} />
                                    Check Out
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </motion.div>

        </div>
    )
}

export default AddAttendance;