import { UserRoundPlus, X, UserRound, BriefcaseBusiness, User, Mail, Phone, MapPin } from 'lucide-react';
import { edit_employee } from '../api/user/editUser';
import { useState } from 'react';
import { motion } from "framer-motion"
import { toast } from "react-toastify";

const EditEmployee = ({ Close, employeeData, employeeId, EmployeeUpdated }) => {
    const [editForm, seteditForm] = useState({
        name: employeeData.name,
        email: employeeData.email,
        phone: employeeData.phone,
        location: employeeData.location,
        department: employeeData.department,
        type: employeeData.type,
        joining_date: employeeData.joining_date,
        salary: employeeData.salary,
        status: employeeData.status,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        seteditForm({
            ...editForm,
            [name]: name === "type" || name === "salary" ? Number(value) : value,
        });
    };

    const data = { ...editForm, employeeId };

    const handleEdit = async () => {
        try {
            const result = await edit_employee(data);

            if (result?.status) {
                const updatedEmployee = {
                    ...employeeData,
                    ...editForm,
                    _id: employeeId,
                };

                EmployeeUpdated(updatedEmployee);
                Close();

                toast.success(result.message, {
                    position: "top-center",
                    autoClose: 5000,
                    theme: "colored",
                });
            }
        } catch (error) {
            console.log("Update error:", error);
        }
    };

    const inputClass = "w-full rounded-lg border border-[#9CA3AF] px-3 py-2 text-sm placeholder:text-[#9CA3AF] focus:border-indigo-500 focus:outline-none";

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
                            <h1 className="modal-title">Update Employee</h1>
                            <p className="text-sm text-[#94A3B8]">Update the employee's information below</p>
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
                                <input name="name" value={editForm.name} onChange={handleChange} className={`${inputClass} pl-9`} type="text" placeholder="e.g Jane Smith" />
                            </div>
                        </div>

                        <div className="modal-row">
                            <div className="modal-field">
                                <label className="modal-label">Email address*</label>
                                <div className="relative">
                                    <Mail className="absolute top-2 left-2 text-[#9CA3AF]" size={22} />
                                    <input name="email" value={editForm.email} onChange={handleChange} className={`${inputClass} pl-9`} type="text" placeholder="jane@gmail.com" />
                                </div>
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">Phone*</label>
                                <div className="relative">
                                    <Phone className="absolute top-2 left-2 text-[#9CA3AF]" size={22} />
                                    <input name="phone" value={editForm.phone} onChange={handleChange} className={`${inputClass} pl-9`} type="tel" placeholder="+91 87087-16077" />
                                </div>
                            </div>
                        </div>

                        <div className="modal-row">
                            <div className="modal-field sm:w-full">
                                <label className="modal-label">Location*</label>
                                <div className="relative">
                                    <MapPin className="absolute top-2 left-2 text-[#9CA3AF]" size={22} />
                                    <input name="location" value={editForm.location} onChange={handleChange} className={`${inputClass} pl-9`} type="text" placeholder="Select Location" />
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
                                <select name="department" value={editForm.department} onChange={handleChange} className={inputClass}>
                                    <option value="default">Select</option>
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
                                <select name="type" value={editForm.type} onChange={handleChange} className={inputClass}>
                                    <option value="2">HR</option>
                                    <option value="3">Employee</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-row">
                            <div className="modal-field">
                                <label className="modal-label">Joining date*</label>
                                <input name="joining_date" value={editForm.joining_date} onChange={handleChange} className={inputClass} type="date" />
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">Salary*</label>
                                <input name="salary" value={editForm.salary} onChange={handleChange} className={inputClass} type="number" placeholder="$ 120,000" />
                            </div>
                        </div>

                        <div className="w-full">
                            <h1 className="modal-label">Status*</h1>
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        seteditForm({ ...editForm, status: editForm.status === 1 ? 0 : 1 })
                                    }
                                    className={`relative h-6 w-12 rounded-full transition-colors duration-200 ${editForm.status === 1 ? 'bg-[#6C63FF]' : 'bg-[#CBD5E1]'}`}
                                    aria-label="Toggle status"
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${editForm.status === 1 ? 'translate-x-6' : 'translate-x-0'}`}
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
                            <button type="button" onClick={handleEdit} className="modal-primary">Update</button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EditEmployee;
