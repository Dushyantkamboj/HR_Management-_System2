import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { delete_leave } from "../api/Leave/deleteLeave";

const DeleteLeave = ({ leaveId, Close, LeaveDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      const response = await delete_leave(leaveId);

      if (response?.data?.status === 1) {
        toast.success(
          response?.data?.message || "Leave request deleted successfully"
        );

        LeaveDeleted(leaveId);

        Close();
      } else {
        toast.error(
          response?.data?.message || "Unable to delete leave request"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
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
        className="modal-panel max-w-sm p-6"
      >
        <div className="flex justify-end">
          <button
            onClick={Close}
            className="rounded-full p-2 hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="text-red-500" size={25} />
          </div>

          <h2 className="text-xl font-semibold">Delete Leave</h2>

          <p className="mt-2 text-sm text-gray-500">
            do you want to delete leave
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={Close}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="rounded-lg bg-red-500 px-5 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Deleting..." : "OK"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteLeave;
