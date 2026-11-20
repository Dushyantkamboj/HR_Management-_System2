import { useState } from "react";
import { CalendarDays, X, Info } from "lucide-react";
import { update_event } from "../api/event/updateEvent";
import { motion } from "framer-motion"
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
              <CalendarDays style={{ width: 20, height: 20, color: "white" }} />
            </div>
            <div className="min-w-0">
              <h1 className="modal-title">Edit Event</h1>
              <p className="text-sm text-[#94A3B8]">Update the details of your event</p>
            </div>
          </div>
          <button onClick={() => Close()} className="modal-close" aria-label="Close">
            <X className="text-[#64748B]" size={20} />
          </button>
        </div>

        {/* Event details */}
        <div className="modal-section mt-2">
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
            <div className="modal-field sm:w-full">
              <label className="modal-label">Event title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="modal-input"
                placeholder="e.g Quarterly all-hands"
                required
              />
            </div>

            <div className="modal-row">
              <div className="modal-field">
                <label className="modal-label">Category*</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="modal-input"
                  required
                />
              </div>
              <div className="modal-field">
                <label className="modal-label">Status*</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="modal-select"
                >
                  <option value={0}>Upcoming</option>
                  <option value={1}>Completed</option>
                  <option value={2}>Cancelled</option>
                </select>
              </div>
            </div>

            <div className="modal-row">
              <div className="modal-field">
                <label className="modal-label">Date*</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="modal-input"
                  required
                />
              </div>
              <div className="modal-field">
                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="modal-label">Starts*</label>
                    <input
                      type="text"
                      name="starts"
                      placeholder="10:00 AM"
                      value={formData.starts}
                      onChange={handleChange}
                      className="modal-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="modal-label">Ends*</label>
                    <input
                      type="text"
                      name="ends"
                      placeholder="11:30 AM"
                      value={formData.ends}
                      onChange={handleChange}
                      className="modal-input"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-row">
              <div className="modal-field">
                <label className="modal-label">Location*</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="modal-input"
                  required
                />
              </div>
              <div className="modal-field">
                <label className="modal-label">Organizer*</label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  className="modal-input"
                  required
                />
              </div>
            </div>

            <div className="modal-field sm:w-full">
              <label className="modal-label">Expected attendees*</label>
              <input
                type="number"
                name="attendees"
                value={formData.attendees}
                onChange={handleChange}
                className="modal-input"
                placeholder="0"
                required
              />
            </div>
          </form>
        </div>

        <div className="mt-5">
          <div className="modal-info">
            <Info className="mt-0.5 shrink-0" style={{ width: 15, height: 15, color: "#4F8EF7" }} />
            <p>Invitations can be shared with employees after the event is saved.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer mt-5">
          <div className="modal-footer-row">
            <p className="text-sm text-[#6B7280]">*Required fields</p>
            <div className="modal-actions">
              <button type="button" onClick={() => Close()} className="modal-cancel">Cancel</button>
              <button type="submit" onClick={handleSubmit} disabled={loading} className="modal-primary font-semibold">
                {loading ? "Updating..." : "Update Event"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditEvent;
