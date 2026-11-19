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

    const sendAttendance = async (attendanceType) => {
        if (!date) return;

        try {
            setLoading(true);

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

    const handleCheckIn = () => sendAttendance(1);
    const handleCheckOut = () => sendAttendance(2);

    return (
        <div className="modal-overlay">
            <motion.div
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, ease: "linear" }}
                className="modal-panel max-w-lg"
            >
                {/* Header */}
                <div className="modal-header pl-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="modal-icon">
                            <CalendarDays style={{ width: 20, height: 20, color: "white" }} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="modal-title">Add Attendance</h1>
                            <p className="text-sm text-[#94A3B8]">Mark your attendance</p>
                        </div>
                    </div>
                    <button type="button" onClick={() => Close()} className="modal-close" aria-label="Close">
                        <X className="text-[#64748B]" size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex w-full flex-col gap-5 px-5 py-5">
                    <div className="w-full">
                        <label className="modal-label">Date *</label>
                        <input
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="modal-input"
                            type="date"
                            required
                        />
                    </div>

                    <div className="modal-info !mx-0">
                        <Info className="mt-0.5 shrink-0" style={{ width: 15, height: 15, color: "#4F8EF7" }} />
                        <p>Check In when you arrive and Check Out when you leave.</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <div className="modal-footer-row">
                        <p className="text-sm text-[#6B7280]">*Required fields</p>
                        <div className="modal-actions">
                            <button type="button" onClick={() => Close()} className="modal-cancel">Cancel</button>

                            <button
                                type="button"
                                onClick={handleCheckIn}
                                disabled={loading}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#16A34A] bg-[#16A34A] px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                            >
                                <LogIn size={18} />
                                Check In
                            </button>

                            <button
                                type="button"
                                onClick={handleCheckOut}
                                disabled={loading}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#DC2626] bg-[#DC2626] px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                            >
                                <LogOut size={18} />
                                Check Out
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AddAttendance;
