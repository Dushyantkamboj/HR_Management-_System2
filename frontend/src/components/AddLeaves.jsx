import { CalendarDays, X, Info } from 'lucide-react';
import { motion } from "framer-motion"
import { useState } from 'react';
import { add_leave } from '../api/Leave/addLeave.js';

// Leave types: value backend ko jati hai, label form mein dikhta hai
const LEAVE_TYPES = [
    { value: 1, label: "Sick leave" },
    { value: 2, label: "Casual leave" },
    { value: 3, label: "Annual leave" },
    { value: 4, label: "Unpaid leave" },
];

// Day types: 1 = Full day, 2 = Half day
const DAY_TYPES = [
    { value: 1, label: "Full day" },
    { value: 2, label: "Half day" },
];

// Today's date as "YYYY-MM-DD" (local time)
const getToday = () => new Date().toLocaleDateString("en-CA");

// Total days between two dates (both days included) - sirf form mein dikhane ke liye
const getTotalDays = (from, to, type) => {
    if (!from || !to) return 0;

    // Half day sirf ek din ka hota hai
    if (type === 2) return 0.5;

    const s = new Date(`${from}T00:00:00`);
    const e = new Date(`${to}T00:00:00`);
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;

    return diff > 0 ? diff : 0;
};

const AddLeave = ({ Close, getLeaves }) => {

    const [formData, setFormData] = useState({
        leave_type: 1,   // 1 = Sick, 2 = Casual, 3 = Annual, 4 = Unpaid
        type: 1,         // 1 = Full day, 2 = Half day
        from_date: getToday(),
        to_date: getToday(),
        reason: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isHalfDay = formData.type === 2;

    // Sirf display ke liye (backend ko nahi bhejte)
    const totalDays = getTotalDays(formData.from_date, formData.to_date, formData.type);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            // leave_type aur type ko number ke roop mein save karo
            const updated = {
                ...prev,
                [name]: name === "leave_type" || name === "type" ? Number(value) : value
            };

            // Agar from date to date se aage chali jaye to to date bhi wahi kar do
            if (name === "from_date" && updated.to_date < value) {
                updated.to_date = value;
            }

            // Half day mein to date hamesha from date ke barabar
            if (updated.type === 2) {
                updated.to_date = updated.from_date;
            }

            return updated;
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (totalDays <= 0) {
            setError("To date cannot be before from date.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // total_days nahi bhejna, sirf formData jata hai
            const response = await add_leave(formData);

            console.log("Add leave response:", response);

            if (response?.data?.status === 1) {
                if (getLeaves) getLeaves();
                Close();
            } else {
                setError(response?.data?.message || "Could not apply leave. Please try again.");
            }

        } catch (err) {
            console.log("Add leave error:", err);
            setError(err?.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex justify-center items-center">
            <motion.div initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                transition={{
                    duration: 0.3,
                    ease: "linear",
                }}
                className="border min-w-150 bg-[#FFFFFF] border-[#FFFFFF] rounded-xl flex flex-col gap-5">

                {/* Header */}
                <div className="sticky z-20 flex justify-between items-center border-b border-[#E5E7EB] w-full h-20">
                    <div className='flex justify-center items-center gap-2 ml-5'>
                        <div className='border h-10 w-10 bg-[linear-gradient(135deg,rgb(79,142,247),rgb(108,99,255))] rounded-xl border-[#6C63FF] flex justify-center items-center '>
                            <CalendarDays style={{ width: 20, height: 20, color: "white" }} />
                        </div>
                        <div>
                            <h1 className='text-[#0F172A] font-semibold text-xl'>Apply for leave</h1>
                            <p className='text-sm text-[#94A3B8]'>Submit a new leave request</p>
                        </div>
                    </div>
                    <button type="button" onClick={() => Close()} className='border h-10 w-10 flex justify-center items-center rounded-xl bg-[#F8FAFC] border-[#E8EDF5] mr-5'>
                        <X className='text-[#64748B]' size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className='w-full flex flex-col gap-5'>

                    {/* Leave type + Day type */}
                    <div className='w-full flex items-center gap-5 pl-5 pr-5'>
                        <div className='w-1/2 flex flex-col'>
                            <label className='text-sm text-[#475569] font-medium'>Leave type *</label>
                            <select
                                name="leave_type"
                                value={formData.leave_type}
                                onChange={handleChange}
                                className='w-full border bg-[#F8FAFC] border-[#E2E8F0] py-2 pl-2 rounded-lg focus:outline-none'
                                required
                            >
                                {LEAVE_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='w-1/2 flex flex-col'>
                            <label className='text-sm text-[#475569] font-medium'>Day type *</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className='w-full border bg-[#F8FAFC] border-[#E2E8F0] py-2 pl-2 rounded-lg focus:outline-none'
                                required
                            >
                                {DAY_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className='w-full flex items-center gap-5 pl-5 pr-5'>
                        <div className='w-1/2 flex flex-col'>
                            <label className='text-sm text-[#475569] font-medium'>
                                {isHalfDay ? "Date *" : "From *"}
                            </label>
                            <input
                                name="from_date"
                                value={formData.from_date}
                                onChange={handleChange}
                                className='w-full border bg-[#F8FAFC] border-[#E2E8F0] py-2 pl-2 text-sm rounded-lg focus:outline-none'
                                type="date"
                                required
                            />
                        </div>
                        <div className='w-1/2 flex flex-col'>
                            <label className='text-sm text-[#475569] font-medium'>To *</label>
                            <input
                                name="to_date"
                                value={formData.to_date}
                                onChange={handleChange}
                                min={formData.from_date}
                                disabled={isHalfDay}
                                className='w-full border bg-[#F8FAFC] border-[#E2E8F0] py-2 pl-2 text-sm rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
                                type="date"
                                required
                            />
                        </div>
                    </div>

                    {/* Total days (sirf dikhane ke liye, backend ko nahi jata) */}
                    <div className='w-full flex flex-col pl-5 pr-5'>
                        <label className='text-sm text-[#475569] font-medium'>Total days</label>
                        <input
                            value={totalDays ? `${totalDays} ${totalDays === 1 ? "day" : "days"}` : ""}
                            readOnly
                            tabIndex={-1}
                            placeholder='Calculated from the dates'
                            className='w-full border bg-[#F1F5F9] border-[#E2E8F0] placeholder:text-[#9CA3AF] py-2 pl-2 text-sm rounded-lg focus:outline-none cursor-not-allowed'
                            type="text"
                        />
                    </div>

                    {/* Reason */}
                    <div className='w-full flex flex-col pl-5 pr-5'>
                        <label className='text-sm text-[#475569] font-medium'>Reason *</label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            rows={3}
                            placeholder='Write the reason for your leave'
                            className='w-full border bg-[#F8FAFC] border-[#E2E8F0] placeholder:text-[#9CA3AF] py-2 pl-2 text-sm rounded-lg focus:outline-none resize-none'
                            required
                        />
                    </div>

                    {/* Info / error */}
                    <div className='w-full'>
                        <div className={`relative min-w-120 h-10 ml-5 mr-5 border flex items-center gap-2 rounded-lg ${error ? "bg-red-50 border-red-200" : "bg-[#F8FAFC] border-[#E2E8F0]"}`}>
                            <div className='absolute ml-2 top-2.1'>
                                <Info style={{ width: "15px", height: "15px", color: error ? "#DC2626" : "#4F8EF7" }} />
                            </div>
                            <p className={`ml-8 text-sm ${error ? "text-red-600" : "text-[#9CA3AF]"}`}>
                                {error || "Your leave request will be sent for approval."}
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className='w-full border-t border-[#E5E7EB] pl-5 pr-5'>
                        <div className='w-full flex justify-between items-center mt-6 mb-5'>
                            <p className='text-sm text-[#6B7280]'>*Required fields</p>
                            <div className='flex gap-5'>
                                <button
                                    type="button"
                                    onClick={() => Close()}
                                    className='border border-[#9CA3AF] px-2 py-2 rounded-lg text-[#6B7280]'
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className='flex items-center justify-center gap-2 border rounded-lg bg-[#6C63FF] text-white px-3 py-2 font-semibold disabled:opacity-60 disabled:cursor-not-allowed'
                                >
                                    {loading ? "Applying..." : "Apply Leave"}
                                </button>
                            </div>
                        </div>
                    </div>

                </form>

            </motion.div>
        </div>
    )
}

export default AddLeave;