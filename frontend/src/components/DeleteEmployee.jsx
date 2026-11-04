import { Trash } from "lucide-react"
import { delete_employee } from "../api/user/deleteUser"
import { motion } from "framer-motion";
import { toast } from "react-toastify"; 

const DeleteEmployee = ({ Close, employeeId, name, deleteEmployee }) => {

  // const handleDelete = async () => {
  //   try {
  //     const result = await delete_employee(
  //       {
  //         employeeId: employeeId
  //       }
  //     )

  //     if (result.status) {
  //       deleteEmployee(employeeId)
  //       Close();

  //       toast.success(result.message, {
  //         position: "top-center",
  //         autoClose: 5000,
  //         hideProgressBar: false,
  //         closeOnClick: false,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //       });

  //     }

  //   } catch (error) {

  //     console.log('Delete error', error.message);
  //   }
  // }
const handleDelete = async () => {

  try {

    const result = await delete_employee({
      employeeId,
    });

    if (result?.status) {

      deleteEmployee(employeeId);

      Close();

      toast.success(result.message, {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
    }

  } catch (error) {

    console.log(
      "Delete error:",
      error
    );

  }
};
  return (
    <div className="fixed z-[70] inset-0 bg-[#0F172A]/20 backdrop-blur-sm flex justify-center items-center">
      <motion.div
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.3,
          ease: "linear",
        }}
        className="min-w-120 min-h-80 border flex flex-col items-center justify-center gap-5 bg-[#FFFFFF] border-[#FFFFFF] rounded-xl">
        <div className="flex flex-col items-center gap-5">
          <div className="w-15 h-15 border rounded-xl flex items-center justify-center bg-red-50 border-red-50">
            <Trash style={{ color: "red" }} />
          </div>
          <h1 className="font-bold text-xl">Remove Employee?</h1>
          <p className="w-100 text-center text-[#64748B]">You're about to remove <span className="text-black font font-semibold">{name}</span> from the system. This action cannot be undone.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => Close()} className="w-40 border border-[#E2E8F0] bg-[#F8FAFC] rounded-xl text-[#64748B]">Cancel</button>
          <button onClick={() => handleDelete()} className="w-40 border py-2 px-2 bg-[linear-gradient(135deg,rgb(247,79,126),rgb(225,29,72))] rounded-xl border-white text-white font-semibold">Yes,Remove</button>
        </div>
      </motion.div>
    </div>
  )
}

export default DeleteEmployee
