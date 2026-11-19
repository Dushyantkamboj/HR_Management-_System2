import { CalendarDays, X, Info } from 'lucide-react';
import { motion } from "framer-motion"
import { useState } from 'react';
import { add_leave } from '../api/Leave/addLeave.js';

// Leave types: value sent to backend, label shown in the form
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

// Total days between two dates (both days included) - display only
const getTotalDays = (from, to, type) => {
    if (!from || !to) return 0;
    if (type === 2) return 0.5;

    const s = new Date(`${from}T00:00:00`);
    const e = new Date(`${to}T00:00:00`);
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;

    return diff > 0 ? diff : 0;
};

const AddLeave = ({ Close, getLeaves }) => {
    const [formData, setFormData] = useState({
        leave_type: 1,
        type: 1,
        from_date: getToday(),
        to_date: getToday(),
        reason: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isHalfDay = formData.type === 2;
    const totalDays = getTotalDays(formData.from_date, formData.to_date, formData.type);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const updated = {
                ...prev,
                [name]: name === "leave_type" || name === "type" ? Number(value) : value
            };

            if (name === "from_date" && updated.to_date < value) {
                updated.to_date = value;
            }

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
        <div className="modal-overlay">
            <motion.div
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, ease: "linear" }}
                className="modal-panel max-w-xl"
            >
                {/* Header */}
                <div className="modal-header pl-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="modal-icon">
                            <CalendarDays style={{ width: 20, height: 20, color: "white" }} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="modal-title">Apply for leave</h1>
                            <p className="text-sm text-[#94A3B8]">Submit a new leave request</p>
                        </div>
                    </div>
                    <button type="button" onClick={() => Close()} className="modal-close" aria-label="Close">
                        <X className="text-[#64748B]" size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5 px-5 py-5">
                    {/* Leave type + Day type */}
                    <div className="modal-row">
                        <div className="modal-field">
                            <label className="modal-label">Leave type *</label>
                            <select name="leave_type" value={formData.leave_type} onChange={handleChange} className="modal-select" required>
                                {LEAVE_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="modal-field">
                            <label className="modal-label">Day type *</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="modal-select" required>
                                {DAY_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="modal-row">
                        <div className="modal-field">
                            <label className="modal-label">{isHalfDay ? "Date *" : "From *"}</label>
                            <input name="from_date" value={formData.from_date} onChange={handleChange} className="modal-input" type="date" required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">To *</label>
                            <input
                                name="to_date"
                                value={formData.to_date}
                                onChange={handleChange}
                                min={formData.from_date}
                                disabled={isHalfDay}
                                className="modal-input disabled:cursor-not-allowed disabled:opacity-50"
                                type="date"
                                required
                            />
                        </div>
                    </div>

                    {/* Total days (display only) */}
                    <div className="w-full">
                        <label className="modal-label">Total days</label>
                        <input
                            value={totalDays ? `${totalDays} ${totalDays === 1 ? "day" : "days"}` : ""}
                            readOnly
                            tabIndex={-1}
                            placeholder="Calculated from the dates"
                            className="modal-input cursor-not-allowed bg-[#F1F5F9] placeholder:text-[#9CA3AF]"
                            type="text"
                        />
                    </div>

                    {/* Reason */}
                    <div className="w-full">
                        <label className="modal-label">Reason *</label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Write the reason for your leave"
                            className="modal-input resize-none"
                            required
                        />
                    </div>

                    {/* Info / error */}
                    <div className={`modal-info !mx-0 ${error ? "border-red-200 bg-red-50" : ""}`}>
                        <Info
                            className="mt-0.5 shrink-0"
                            style={{ width: 15, height: 15, color: error ? "#DC2626" : "#4F8EF7" }}
                        />
                        <p className={error ? "text-red-600" : ""}>
                            {error || "Your leave request will be sent for approval."}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer -mx-5">
                        <div className="modal-footer-row">
                            <p className="text-sm text-[#6B7280]">*Required fields</p>
                            <div className="modal-actions">
                                <button type="button" onClick={() => Close()} className="modal-cancel">Cancel</button>
                                <button type="submit" disabled={loading} className="modal-primary">
                                    {loading ? "Applying..." : "Apply Leave"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddLeave;
