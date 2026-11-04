import { useState } from "react";
import { X } from "lucide-react";
import { update_event } from "../api/event/updateEvent";
import { toast } from "react-toastify";

const EditEvent = ({ event, Close, updateEvent }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    eventId: event._id,
    title: event.title || "",
    category: event.category || "",
    status: Number(event.status),
    date: event.date || "",
    starts: event.starts || "",
    ends: event.ends || "",
    location: event.location || "",
    organizer: event.organizer || "",
    attendees: event.attendees || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "status" || name === "attendees"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await update_event(formData);

      if (response.data.status === 1) {
        toast.success(response.data.message || "Event updated successfully");

        updateEvent(formData);

        Close();
      } else {
        toast.error(response.data.message || "Unable to update event");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">
            Edit Event
          </h2>

          <button
            onClick={Close}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 p-6"
        >

          {/* Title */}
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Event Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
            >
              <option value={0}>Upcoming</option>
              <option value={1}>Completed</option>
              <option value={2}>Cancelled</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
              required
            />
          </div>

          {/* Starts */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Starts
            </label>

            <input
              type="text"
              name="starts"
              placeholder="10:00 AM"
              value={formData.starts}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
              required
            />
          </div>

          {/* Ends */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Ends
            </label>

            <input
              type="text"
              name="ends"
              placeholder="11:30 AM"
              value={formData.ends}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
              required
            />
          </div>

          {/* Organizer */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Organizer
            </label>

            <input
              type="text"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
              required
            />
          </div>

          {/* Attendees */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Attendees
            </label>

            <input
              type="number"
              name="attendees"
              value={formData.attendees}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
              required
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={Close}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#6C63FF] px-5 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Event"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditEvent;