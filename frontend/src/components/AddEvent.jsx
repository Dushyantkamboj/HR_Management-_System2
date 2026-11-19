import { CalendarDays, X, Info } from 'lucide-react';
import { motion } from "framer-motion"
import { useState } from 'react';
import { add_event } from '../api/event/addEvent';

const AddEvent = ({ Close, eventAdded }) => {
    const [formData, setformData] = useState({
        title: " ",
        category: " ",
        status: " ",
        date: " ",
        starts: " ",
        ends: " ",
        location: " ",
        organizer: " ",
        attendees: " ",
    });

    const handleChange = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const Status = formData.status === "Upcoming" ? 0 : formData.status === "In progress" ? 1 : formData.status === "Completed" ? 2 : " ";
            const eventData = { ...formData, status: Status };

            const result = await add_event(eventData);
            console.log('result:', result);

            if (result.data.status) {
                if (eventAdded) eventAdded();
                Close();
            }
        } catch (error) {
            console.log('error:', error);
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
                            <h1 className="modal-title">Create new event</h1>
                            <p className="text-sm text-[#94A3B8]">Plan a new moment for your team</p>
                        </div>
                    </div>
                    <button onClick={() => Close()} className="modal-close" aria-label="Close">
                        <X className="text-[#64748B]" size={20} />
                    </button>
                </div>

                {/* Event details */}
                <div className="modal-section mt-2">
                    <form className="flex w-full flex-col gap-3">
                        <div className="modal-field sm:w-full">
                            <label className="modal-label">Event title *</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="modal-input"
                                type="text"
                                placeholder="e.g Quarterly all-hands"
                            />
                        </div>

                        <div className="modal-row">
                            <div className="modal-field">
                                <label className="modal-label">Category*</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="modal-select">
                                    <option value="Company">Company</option>
                                    <option value="HR">HR</option>
                                    <option value="Social">Social</option>
                                    <option value="Training">Training</option>
                                </select>
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">Status*</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="modal-select">
                                    <option value="default">select status</option>
                                    <option value="Upcoming">Upcoming</option>
                                    <option value="In progress">In progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-row">
                            <div className="modal-field">
                                <label className="modal-label">Date*</label>
                                <input name="date" value={formData.date} onChange={handleChange} className="modal-input" type="date" />
                            </div>
                            <div className="modal-field">
                                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="modal-label">Starts*</label>
                                        <input name="starts" value={formData.starts} onChange={handleChange} className="modal-input" type="time" />
                                    </div>
                                    <div>
                                        <label className="modal-label">Ends*</label>
                                        <input name="ends" value={formData.ends} onChange={handleChange} className="modal-input" type="time" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-row">
                            <div className="modal-field">
                                <label className="modal-label">Location*</label>
                                <input name="location" value={formData.location} onChange={handleChange} className="modal-input" type="text" placeholder="Room or Video Link" />
                            </div>
                            <div className="modal-field">
                                <label className="modal-label">Organizer*</label>
                                <input name="organizer" value={formData.organizer} onChange={handleChange} className="modal-input" type="text" placeholder="Organizer name" />
                            </div>
                        </div>

                        <div className="modal-field sm:w-full">
                            <label className="modal-label">Expected attendees*</label>
                            <input name="attendees" value={formData.attendees} onChange={handleChange} className="modal-input" type="number" placeholder="0" />
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
                            <button type="button" onClick={handleSubmit} className="modal-primary font-semibold">Create Event</button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AddEvent;
