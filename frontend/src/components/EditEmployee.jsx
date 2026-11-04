import { UserRoundPlus, X, UserRound, BriefcaseBusiness, User, Mail, Phone, MapPin } from 'lucide-react';
import { edit_employee } from '../api/user/editUser';
import { useState } from 'react';
import { motion } from "framer-motion"
import { toast } from "react-toastify";

const EditEmployee = ({ Close, employeeData, employeeId, EmployeeUpdated }) => {

    const [editForm, seteditForm] = useState(
        {
            name: employeeData.name,
            email: employeeData.email,
            phone: employeeData.phone,
            location: employeeData.location,
            department: employeeData.department,
            type: employeeData.type,
            joining_date: employeeData.joining_date,
            salary: employeeData.salary,
            status:employeeData.status,
        }
    )

    // const handleChange = (e) => {
    //     seteditForm({ ...editForm, [e.target.name]: e.target.value })
    // }
    const handleChange = (e) => {

  const { name, value } = e.target;

  seteditForm({
    ...editForm,

    [name]:
      name === "type" || name === "salary"
        ? Number(value)
        : value,
  });
};

    const data = {
        ...editForm,
        employeeId
    }

    // const handleEdit = async () => {
    //     try {
    //         const result = await edit_employee(data)

    //         if (result.status) {
             
                
    //             Close();

    //             toast.success(result.message, {
    //                 position: "top-center",
    //                 autoClose: 5000,
    //                 hideProgressBar: false,
    //                 closeOnClick: false,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //                 progress: undefined,
    //                 theme: "colored",
    //             });
    //         }

    //     } catch (error) {     
    //         console.log('error:', error.message);
    //     }
    // }

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

    console.log(
      "Update error:",
      error
    );

  }
};

    return (
        <div>
            <div className="fixed inset-0 z-[70] bg-black/10 backdrop-blur-sm flex justify-center items-center">
                <motion.div
                    initial={{ scale: 0.96 }}
                    animate={{ scale: 1 }}
                    transition={{
                        duration: 0.3,
                        ease: "linear",
                    }}

                    className="border min-w-130 min-h-160 bg-[#FFFFFF] border-[#FFFFFF] rounded-xl flex flex-col gap-5">
                    <div className="sticky z-20 flex justify-between items-center border-b border-[#E5E7EB] w-full h-20">
                        <div className='flex justify-center items-center gap-2 ml-5'>
                            <div className='border h-10 w-10 bg-[linear-gradient(135deg,rgb(79,142,247),rgb(108,99,255))] rounded-xl border-[#6C63FF] flex justify-center items-center '>
                                <UserRoundPlus style={{ width: 20, height: 20, color: "white" }} />
                            </div>
                            <div>
                                <h1 className='text-[#0F172A] font-semibold text-xl'>Update Employee</h1>
                                <p className='text-sm text-[#94A3B8]'>Update the employee's information below</p>
                            </div>
                        </div>
                        <button onClick={() => Close()} className='border h-10 w-10 flex justify-center items-center rounded-xl bg-[#F8FAFC] border-[#E8EDF5] mr-5'>
                            <X className='text-[#64748B]' size={20} />
                        </button>
                    </div>
                    <div className='w-full min-h-30'>
                        <div className='flex items-center gap-1 pl-5'>
                            <UserRound size={20} style={{ color: "blue" }} />
                            <h1 className='font-bold text-sm'>Personal Information</h1>
                        </div>
                        <div>
                            <form className='w-full max-auto mt-2 flex flex-col gap-2'>
                                <div className='w-full flex flex-col pl-5 pr-5'>
                                    <label className='text-sm'>Full name*</label>
                                    <div className='relative'>
                                        <User className='absolute top-2 pl-2 text-[#9CA3AF] ' size={25} />
                                        <input name='name' value={editForm.name} onChange={handleChange} className='w-full max-auto border border-[#9CA3AF] placeholder:text-[#9CA3AF] py-2 pl-8 text-sm rounded-lg focus:outline-none' type="text" placeholder='e.g Jane Smith' />
                                    </div>
                                </div>
                                <div className='w-full flex items-center gap-2 pl-5 pr-5'>
                                    <div className='w-1/2 flex flex-col'>
                                        <label className='text-sm'>Email address*</label>
                                        <div className='relative'>
                                            <Mail className='absolute top-3 pl-2 text-[#9CA3AF]' size={25} />
                                            <input name='email' value={editForm.email} onChange={handleChange} className='w-full border border-[#9CA3AF] placeholder:text-[#9CA3AF] py-2 pl-8  rounded-lg focus:outline-none' type="text" placeholder='jane@gmail' />
                                        </div>
                                    </div>
                                    <div className='w-1/2 flex flex-col'>
                                        <label className='text-sm'>Phone*</label>
                                        <div className='relative'>
                                            <Phone className='absolute top-3 pl-2 text-[#9CA3AF]' size={25} />
                                            <input name='phone' value={editForm.phone} onChange={handleChange} className='w-full border border-[#9CA3AF] placeholder:text-[#9CA3AF] py-2 pl-8  rounded-lg focus:outline-none' type="number" placeholder='+91 87087-16077' />
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full flex items-center gap-2 pl-5 pr-5'>
                                    <div className='w-full flex flex-col'>
                                        <label className='text-sm'>Location*</label>
                                        <div className='relative'>
                                            <MapPin className='absolute top-2 pl-2 text-[#9CA3AF]' size={25} />
                                            <input name='location' value={editForm.location} onChange={handleChange} className='w-full border border-[#9CA3AF] placeholder:text-[#9CA3AF] py-2 pl-8  rounded-lg focus:outline-none' type="text" placeholder='Select Location' />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className='w-full min-h-30'>
                        <div className='flex items-center gap-1 pl-5'>
                            <BriefcaseBusiness size={20} style={{ color: "blue" }} />
                            <h1 className='font-bold text-sm'>Job details</h1>
                        </div>
                        <div>
                            <form className='w-full max-auto mt-2 flex flex-col gap-2'>
                                <div className='w-full flex gap-2 pl-5 pr-5'>
                                    <div className='w-1/2 flex flex-col'>
                                        <label className='text-sm'>Department*</label>
                                        <select name='department' value={editForm.department} onChange={handleChange} className='w-full border border-[#9CA3AF] py-2 pl-2 text-sm rounded-lg focus:outline-none'>
                                            <option value="default">Select</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Engineering">Design</option>
                                            <option value="Engineering">Marketing</option>
                                            <option value="Sales">Sales</option>
                                            <option value="HR">HR</option>
                                            <option value="Content Writing">Finance</option>
                                            <option value="UI/UX">Operations</option>
                                        </select>
                                    </div>
                                    <div className='w-1/2 flex flex-col'>
                                        <label className='text-sm'>Role*</label>
                                        <select name='type' value={editForm.type} onChange={handleChange} className='w-full border border-[#9CA3AF] placeholder:text-[#9CA3AF] py-2 pl-2 text-sm rounded-lg focus:outline-none'>
                                            <option default>Select type</option>
                                            <option value={2}>HR</option>
                                            <option value={3}>Employee</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='w-full flex items-center gap-2 pl-5 pr-5'>
                                    <div className='w-1/2 flex flex-col'>
                                        <label className='text-sm'>Joining date*</label>
                                        <input name='joining_date' value={editForm.joining_date} onChange={handleChange} className='w-full border border-[#9CA3AF] py-2 pl-2 text-sm rounded-lg focus:outline-none' type="date" />
                                    </div>
                                    <div className='w-1/2 flex flex-col'>
                                        <label className='text-sm'>Salary*</label>
                                        <input name='salary' value={editForm.salary} onChange={handleChange} className='w-full border border-[#9CA3AF] placeholder:text-[#9CA3AF] py-2 pl-2 text-sm rounded-lg focus:outline-none' type="number" placeholder='$ 120,000' />
                                    </div>
                                </div>
                                <div className='w-full pl-5 pr-5'>
                                    <h1 className='text-sm'>Status*</h1>
                                    <div className='w-full mt-2'>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                seteditForm({
                                                    ...editForm,
                                                    status: editForm.status === 1 ? 0 : 1
                                                })
                                            }
                                            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${editForm.status === 1
                                                ? 'bg-[#6C63FF]'
                                                : 'bg-[#CBD5E1]'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${editForm.status === 1
                                                    ? 'translate-x-6'
                                                    : 'translate-x-0'
                                                    }`}
                                            ></span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className='sticky z-20 w-full border-t border-[#E5E7EB] pl-5 pr-5'>
                        <div className=' w-full flex justify-between items-center mt-3 mb-3'>
                            <p className='text-sm text-[#6B7280]'>*Required fields</p>
                            <div className='flex gap-5'>
                                <button onClick={() => Close()} className='border border-[#9CA3AF] px-2 py-2 rounded-lg text-[#6B7280]'>Cancel</button>
                                <button onClick={() => handleEdit()} className='flex items-center justify-center gap-2 border rounded-lg bg-indigo-600 text-white px-3 py-2'>update</button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default EditEmployee
