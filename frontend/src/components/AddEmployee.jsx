import { useState } from 'react';
import { add_employee } from '../api/user/addUser';
import { UserRoundPlus, X, UserRound, BriefcaseBusiness, Check, User, Mail, Phone, MapPin, LockKeyhole } from 'lucide-react';
import { motion } from "framer-motion"
import { toast } from "react-toastify"; 

const AddEmployee = ({Close, EmployeeAdded}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setformData] = useState(
        {
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
        }
    )

    const handleChange=(e)=>{
        setformData({...formData,[e.target.name]:e.target.value})
    }

    const handleSubmit = async () => {

  if (isLoading) return;

  setIsLoading(true);

  try {

    const employeeData = {
      ...formData,

      type:
        formData.type === "HR"
          ? 2
          : formData.type === "Employee"
            ? 3
            : "",
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

    console.log(
      "Failed to add employee:",
      error
    );

  } finally {

    setIsLoading(false);

  }
};

    return (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex justify-center items-center">
            <motion.div initial={{scale:0.96}}
        animate={{scale:1}}
        transition={{
            duration:0.3,
            ease:"linear",
         }} 
         className="border min-w-130 min-h-160 bg-[#FFFFFF] border-[#FFFFFF] rounded-xl flex flex-col gap-5">
                <div className="sticky z-20 flex justify-between items-center border-b border-[#E5E7EB] w-full h-20">
                    <div className='flex justify-center items-center gap-2 ml-5'>
                        <div className='border h-10 w-10 bg-[linear-gradient(135deg,rgb(79,142,247),rgb(108,99,255))] rounded-xl border-[#6C63FF] flex justify-center items-center '>
                            <UserRoundPlus style={{ width: 20, height: 20, color: "white" }} />
                        </div>
                        <div>
                            <h1 className='text-[#0F172A] font-semibold text-xl'>Add New Employee</h1>
                            <p className='text-sm text-[#94A3B8]'>Fill in all details to onboard a new team member</p>
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
                                <label className='text-sm font-medium text-[#475569]'>Full name*</label>
                                <div className='relative'>
                                    <User className='absolute top-2 pl-2 text-[#9CA3AF] ' size={25} />
                                    <input onChange={handleChange} className='w-full max-auto border border-[#E2E8F0] bg-[#F8FAFC] placeholder:text-[#9CA3AF] py-2 pl-8 text-sm rounded-lg focus:outline-none' type="text" placeholder='e.g Jane Smith' name='name' value={formData.name} />
                                </div>
                            </div>
                            <div className='w-full flex items-center gap-2 pl-5 pr-5'>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm font-medium text-[#475569]'>Email address*</label>
                                    <div className='relative'>
                                        <Mail className='absolute top-3 pl-2 text-[#9CA3AF]' size={25} />
                                        <input name='email' value={formData.email} onChange={handleChange} className='w-full border border-[#E2E8F0] bg-[#F8FAFC]  placeholder:text-[#9CA3AF] py-2 pl-8  rounded-lg focus:outline-none' type="text"  placeholder='jane@gmail'/>
                                    </div>
                                </div>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm font-medium text-[#475569]'>Phone*</label>
                                    <div className='relative'>
                                        <Phone className='absolute top-3 pl-2 text-[#9CA3AF]' size={25} />
                                        <input onChange={handleChange} className='w-full border border-[#E2E8F0] bg-[#F8FAFC] placeholder:text-[#9CA3AF] py-2 pl-8  rounded-lg focus:outline-none' type="number" placeholder='+91 87087-16077' name='phone' value={formData.phone} />
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex items-center gap-2 pl-5 pr-5'>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm font-medium text-[#475569]'>Password*</label>
                                    <div className='relative'>
                                        <LockKeyhole className='absolute top-2 pl-2 text-[#9CA3AF]' size={25} />
                                        <input name='password' value={formData.password} onChange={handleChange} className='w-full border border-[#E2E8F0] bg-[#F8FAFC]  placeholder:text-[#9CA3AF] py-2 pl-8  rounded-lg focus:outline-none' type="text" placeholder='Dushyantkamboj@5005' />
                                    </div>
                                </div>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm font-medium text-[#475569]'>Location*</label>
                                    <div className='relative'>
                                        <MapPin className='absolute top-2 pl-2 text-[#9CA3AF]' size={25} />
                                        <input onChange={handleChange} className='w-full border border-[#E2E8F0] bg-[#F8FAFC] placeholder:text-[#9CA3AF] py-2 pl-8  rounded-lg focus:outline-none' type="text" placeholder='Select Location' name='location' value={formData.location} />
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
                                    <label className='text-sm font-medium text-[#475569]'>Department*</label>
                                    <select onChange={handleChange} className='w-full border border-[#E2E8F0] bg-[#F8FAFC]  py-2 pl-2 text-sm rounded-lg focus:outline-none' name='department' value={formData.department}>
                                        <option className='text-[#9CA3AF]' value="default">Select</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Design">Design</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Sales">Sales</option>
                                        <option value="HR">HR</option>
                                        <option value="Finance">Finance</option>
                                        <option value="UI/UX">Operations</option>
                                    </select>
                                </div>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm font-medium text-[#475569]'>Role*</label>
                                    <select name='type' value={formData.type} onChange={handleChange} className='w-full border border-[#E2E8F0] bg-[#F8FAFC] placeholder:text-[#9CA3AF] py-2 pl-2 text-sm rounded-lg focus:outline-none'>
                                        <option default>Select type</option>
                                        <option value="HR">HR</option>
                                        <option value="Employee">Employee</option>
                                    </select>
                                </div>
                            </div>
                            <div className='w-full flex items-center gap-2 pl-5 pr-5'>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm font-medium text-[#475569]'>Joining date*</label>
                                    <input onChange={handleChange} className='w-full border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-2 text-sm rounded-lg focus:outline-none' type="date" name='joining_date' value={formData.joining_date} />
                                </div>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm font-medium text-[#475569]'>Salary*</label>
                                    <input onChange={handleChange} className='w-full border border-[#E2E8F0] bg-[#F8FAFC] placeholder:text-[#9CA3AF] py-2 pl-2 text-sm rounded-lg focus:outline-none' type="number" placeholder='$ 120,000' name='salary' value={formData.salary} />
                                </div>
                            </div>
                            <div className='w-full pl-5 pr-5'>
                                <h1 className='text-sm font-medium text-[#475569]'>Status*</h1>
                                <div className='w-full mt-2'>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setformData({
                                                ...formData,
                                                status: formData.status === 1 ? 0 : 1
                                            })
                                        }
                                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${formData.status === 1
                                            ? 'bg-[#6C63FF]'
                                            : 'bg-[#CBD5E1]'
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${formData.status === 1
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
                            <button onClick={()=>Close()} className='border border-[#9CA3AF] px-2 py-2 rounded-lg text-[#6B7280]'>Cancel</button>
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`flex items-center justify-center gap-2 border rounded-lg text-white px-3 py-2 ${isLoading
                                    ? 'bg-[#A5A0F0] cursor-not-allowed'
                                    : 'bg-[#6C63FF]'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
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
    )
}

export default AddEmployee
