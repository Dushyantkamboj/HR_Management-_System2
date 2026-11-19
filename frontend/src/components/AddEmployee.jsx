import { useState } from 'react';
import { add_employee } from '../api/user/addUser';
import { UserRoundPlus, X, UserRound, BriefcaseBusiness, Check, User, Mail, Phone, MapPin, LockKeyhole } from 'lucide-react';
import { motion } from "framer-motion"
import { toast } from "react-toastify";

const AddEmployee = ({ Close, EmployeeAdded }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setformData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        location: "",
        department: "",
        type: "",
        joining_date: "",
        salary: "",
        status: 1
    });

    const handleChange = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const employeeData = {
                ...formData,
                type: formData.type === "HR" ? 2 : formData.type === "Employee" ? 3 : "",
            };

            const result = await add_employee(employeeData);

            if (result?.status) {
                EmployeeAdded(result.data);
                Close();
                toast.success(result.message, {
                    position: "top-center",
                    autoClose: 5000,
                    theme: "colored",
                });
            }
        } catch (error) {
            console.log("Failed to add employee:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <motion.div
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, ease: "linear" }}
                className="modal-panel max-w-2xl"
            >
                {/* Header */}
                <div className="modal-header pl-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="modal-icon">
                            <UserRoundPlus style={{ width: 20, height: 20, color: "white" }} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="modal-title">Add New Employee</h1>
                            <p className="text-sm text-[#94A3B8]">Fill in all details to onboard a new team member</p>
                        </div>
                    </div>
                    <button onClick={() => Close()} className="modal-close" aria-label="Close">
                        <X className="text-[#64748B]" size={20} />
                    </button>
                </div>

                {/* Personal information */}
                <div className="modal-section">
                    <div className="modal-section-title">
                        <UserRound size={20} style={{ color: "blue" }} />
                        <h1>Personal Information</h1>
                    </div>

                    <form className="mt-3 flex w-full flex-col gap-3">
                        <div className="modal-field sm:w-full">
                            <label className="modal-label">Full name*</label>
                            <div className="relative">
                                <User className="absolute top-2 left-2 text-[#9CA3AF]" size={22} />
                                <input
                                    onChange={handleChange}
                                    className="modal-input pl-9"
                                    type="text"
                                    placeholder="e.g Jane Smith"
                                    name="name"
                                    value={formData.name}
                                />
                            </div>
                        </div>

                        <div className="modal-row">
                            <div className="modal-field">
                                <label className="modal-label">Email address*</label>
                                <div className="relative">
                                    <Mail className="absolute top-2 left-2 text-[#9CA3AF]" size={22} />
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="modal-input pl-9"
                                        type="text"
                                        placeholder="jane@gmail.com"
                                    />
                                </div>
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">Phone*</label>
                                <div className="relative">
                                    <Phone className="absolute top-2 left-2 text-[#9CA3AF]" size={22} />
                                    <input
                                        onChange={handleChange}
                                        className="modal-input pl-9"
                                        type="tel"
                                        placeholder="+91 87087-16077"
                                        name="phone"
                                        value={formData.phone}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-row">
                            <div className="modal-field">
                                <label className="modal-label">Password*</label>
                                <div className="relative">
                                    <LockKeyhole className="absolute top-2 left-2 text-[#9CA3AF]" size={22} />
                                    <input
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="modal-input pl-9"
                                        type="text"
                                        placeholder="Enter a strong password"
                                    />
                                </div>
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">Location*</label>
                                <div className="relative">
                                    <MapPin className="absolute top-2 left-2 text-[#9CA3AF]" size={22} />
                                    <input
                                        onChange={handleChange}
                                        className="modal-input pl-9"
                                        type="text"
                                        placeholder="Select Location"
                                        name="location"
                                        value={formData.location}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Job details */}
                <div className="modal-section mt-5">
                    <div className="modal-section-title">
                        <BriefcaseBusiness size={20} style={{ color: "blue" }} />
                        <h1>Job details</h1>
                    </div>

                    <form className="mt-3 flex w-full flex-col gap-3">
                        <div className="modal-row">
                            <div className="modal-field">
                                <label className="modal-label">Department*</label>
                                <select
                                    onChange={handleChange}
                                    className="modal-select"
                                    name="department"
                                    value={formData.department}
                                >
                                    <option className="text-[#9CA3AF]" value="default">Select</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Design">Design</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                    <option value="HR">HR</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Operations">Operations</option>
                                </select>
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">Role*</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="modal-select">
                                    <option value="">Select type</option>
                                    <option value="HR">HR</option>
                                    <option value="Employee">Employee</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-row">
                            <div className="modal-field">
                                <label className="modal-label">Joining date*</label>
                                <input onChange={handleChange} className="modal-input" type="date" name="joining_date" value={formData.joining_date} />
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">Salary*</label>
                                <input onChange={handleChange} className="modal-input" type="number" placeholder="$ 120,000" name="salary" value={formData.salary} />
                            </div>
                        </div>

                        <div className="w-full">
                            <h1 className="modal-label">Status*</h1>
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setformData({ ...formData, status: formData.status === 1 ? 0 : 1 })
                                    }
                                    className={`relative h-6 w-12 rounded-full transition-colors duration-200 ${formData.status === 1 ? 'bg-[#6C63FF]' : 'bg-[#CBD5E1]'}`}
                                    aria-label="Toggle status"
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${formData.status === 1 ? 'translate-x-6' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="modal-footer mt-6">
                    <div className="modal-footer-row">
                        <p className="text-sm text-[#6B7280]">*Required fields</p>
                        <div className="modal-actions">
                            <button type="button" onClick={() => Close()} className="modal-cancel">Cancel</button>
                            <button onClick={handleSubmit} disabled={isLoading} className="modal-primary">
                                {isLoading ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Check size={20} />
                                        Add employee
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AddEmployee;
