import { CalendarDays, X, Info } from 'lucide-react';
import { motion } from "framer-motion"
import { useState } from 'react';
import { add_event } from '../api/event/addEvent';


const AddEvent = ({ Close }) => {
    const [formData, setformData] = useState({
        title:" ",
        category:" ",
        status:" ",
        date:" ",
        starts:" ",
        ends:" ",
        location:" ",
        organizer:" ",
        attendees:" ",

    })

    const handleChange=(e)=>{
        setformData({...formData,[e.target.name]:e.target.value})
    };

    const handleSubmit=async()=>{
        try {

            const Status=formData.status=== "Upcoming" ? 0 : formData.status=== "In progress" ? 1: formData.status=== "Completed" ? 2:" ";

            const eventData={
                ...formData,
                status:Status
            }

            const result=await add_event(eventData)

            console.log('result:',result);

            if(result.data.status){
                Close()
            }
            
        } catch (error) {
            console.log('error:',error);
            
        }
    }

    return (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex justify-center items-center">
            <motion.div initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                transition={{
                    duration: 0.3,
                    ease: "linear",
                }}
                className="border min-w-150 min-h-160 bg-[#FFFFFF] border-[#FFFFFF] rounded-xl flex flex-col gap-5">
                <div className="sticky z-20 flex justify-between items-center border-b border-[#E5E7EB] w-full h-20">
                    <div className='flex justify-center items-center gap-2 ml-5'>
                        <div className='border h-10 w-10 bg-[linear-gradient(135deg,rgb(79,142,247),rgb(108,99,255))] rounded-xl border-[#6C63FF] flex justify-center items-center '>
                            <CalendarDays style={{ width: 20, height: 20, color: "white" }} />
                        </div>
                        <div>
                            <h1 className='text-[#0F172A] font-semibold text-xl'>Create new event</h1>
                            <p className='text-sm text-[#94A3B8]'>Plan a new moment for your team</p>
                        </div>
                    </div>
                    <button onClick={() => Close()} className='border h-10 w-10 flex justify-center items-center rounded-xl bg-[#F8FAFC] border-[#E8EDF5] mr-5'>
                        <X className='text-[#64748B]' size={20} />
                    </button>
                </div>
                <div className='w-full min-h-30'>
                    <div>
                        <form className='w-full max-auto mt-2 flex flex-col gap-2'>
                            <div className='w-full flex flex-col pl-5 pr-5'>
                                <label className='text-sm font-medium text-[#475569]'>Event title *</label>
                                <div className='relative'>
                                    <input name='title' value={formData.name} onChange={handleChange} className='w-full max-auto border border-[#E2E8F0] bg-[#F8FAFC] placeholder:text-[#9CA3AF] placeholder:font-medium py-2 pl-2 text-sm rounded-lg focus:outline-none' type="text" placeholder='e.g Quarterly all-hands' />
                                </div>
                            </div>
                            <div className='w-full flex items-center gap-2 pl-5 pr-5'>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm text-[#475569] font-medium'>Category*</label>
                                    <select name='category' value={formData.category} onChange={handleChange} className='w-full border bg-[#F8FAFC] border-[#E2E8F0] placeholder:text-[#9CA3AF] py-2 pl-2  rounded-lg focus:outline-none'>
                                        <option value="default">Company</option>
                                        <option value="HR">HR</option>
                                        <option value="Social">Social</option>
                                        <option value="Training">Training</option>
                                    </select>
                                </div>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm text-[#475569] font-medium'>Status*</label>
                                    <select name='status' value={formData.status} onChange={handleChange} className='w-full border bg-[#F8FAFC] border-[#E2E8F0] placeholder:text-[#9CA3AF] py-2 pl-2  rounded-lg focus:outline-none'>
                                        <option value="default">select status</option>
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="In progress">In progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div className='w-full flex items-center gap-2 pl-5 pr-5'>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm text-[#475569] font-medium'>Date*</label>
                                    <input name='date' value={formData.date} onChange={handleChange} className='w-full border bg-[#F8FAFC] border-[#E2E8F0] py-2 pl-2 text-sm rounded-lg focus:outline-none' type="date" />
                                </div>
                                <div className='w-1/2 flex gap-2'>
                                    <div className='w-1/2'>
                                        <label className='text-sm text-[#475569] font-medium'>Starts*</label>
                                        <input name='starts' value={formData.starts} onChange={handleChange} className='w-full border bg-[#F8FAFC] border-[#E2E8F0] py-2 pl-2 text-sm rounded-lg focus:outline-none' type="time" />
                                    </div>
                                    <div className='w-1/2'>
                                        <label className='text-sm text-[#475569] font-medium'>Ends*</label>
                                        <input name='ends' value={formData.ends} onChange={handleChange} className='w-full border bg-[#F8FAFC] border-[#E2E8F0]  py-2 pl-2 text-sm rounded-lg focus:outline-none' type="time" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='w-full min-h-30'>
                    <div>
                        <form className='w-full max-auto mt-2 flex flex-col gap-2'>
                            <div className='w-full flex gap-2 pl-5 pr-5'>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm text-[#475569] font-medium'>Location*</label>
                                    <input name='location' value={formData.location} onChange={handleChange} className='w-full border bg-[#F8FAFC] border-[#E2E8F0] py-2 pl-2 text-sm rounded-lg focus:outline-none placeholder:font-medium' type="text" placeholder='Room or Video Link' />
                                </div>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm text-[#475569] font-medium'>Organizer*</label>
                                    <input name='organizer' value={formData.organizer} onChange={handleChange} className='w-full border bg-[#F8FAFC] border-[#E2E8F0] py-2 pl-2 text-sm rounded-lg focus:outline-none placeholder:font-medium' type="text" placeholder='Organizer name' />
                                </div>
                            </div>
                            <div className='w-full flex items-center gap-2 pl-5 pr-5'>
                                <div className='w-1/2 flex flex-col'>
                                    <label className='text-sm text-[#475569] font-medium'>Expected attendees*</label>
                                    <input name='attendees' value={formData.attendees} onChange={handleChange} className='w-full border bg-[#F8FAFC] border-[#E2E8F0] placeholder:text-black py-2 pl-2 text-sm rounded-lg focus:outline-none placeholder:font-medium' type="number" placeholder='0' />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className='w-full'>
                    <div className='relative min-w-120 h-10 ml-5 mr-5 border bg-[#F8FAFC] border-[#E2E8F0] flex items-center gap-2 rounded-lg'>
                        <div className='absolute ml-2 top-2.1'>
                              <Info style={{ width: "15px", height: "15px", color:"#4F8EF7" }} />
                        </div>
                        <p className='ml-8 text-[#9CA3AF] text-sm'>Invitations can be shared with employees after the event is saved.</p>
                    </div>
                </div>

                <div className='w-full border-t border-[#E5E7EB] pl-5 pr-5'>
                    <div className=' w-full flex justify-between items-center mt-6 mb-5'>
                        <p className='text-sm text-[#6B7280]'>*Required fields</p>
                        <div className='flex gap-5'>
                            <button onClick={() => Close()} className='border border-[#9CA3AF] px-2 py-2 rounded-lg text-[#6B7280]'>Cancel</button>
                            <button onClick={()=>handleSubmit()} className='flex items-center justify-center gap-2 border rounded-lg bg-[#6C63FF] text-white px-3 py-2 font-semibold'>Create Event</button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default AddEvent
