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
    <div className="modal-overlay">
      <motion.div
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.3,
          ease: "linear",
        }}
        className="modal-panel flex max-w-md flex-col items-center justify-center gap-5 p-6">
        <div className="flex flex-col items-center gap-5">
          <div className="w-15 h-15 border rounded-xl flex items-center justify-center bg-red-50 border-red-50">
            <Trash style={{ color: "red" }} />
          </div>
          <h1 className="font-bold text-xl">Remove Employee?</h1>
          <p className="w-full max-w-sm text-center text-[#64748B]">You're about to remove <span className="font-semibold text-black">{name}</span> from the system. This action cannot be undone.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <button onClick={() => Close()} className="w-full border border-[#E2E8F0] bg-[#F8FAFC] py-2 text-[#64748B] sm:w-36">Cancel</button>
          <button onClick={() => handleDelete()} className="w-full border border-white bg-[linear-gradient(135deg,rgb(247,79,126),rgb(225,29,72))] px-2 py-2 font-semibold text-white sm:w-36">Yes, Remove</button>
        </div>
      </motion.div>
    </div>
  )
}

export default DeleteEmployee
