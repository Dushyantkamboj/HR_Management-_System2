import { useState } from 'react';
import { CalendarDays, X, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { update_leave } from '../api/Leave/updateLeave.js';

const LEAVE_TYPES = [
  { value: 1, label: 'Sick leave' },
  { value: 2, label: 'Casual leave' },
  { value: 3, label: 'Annual leave' },
  { value: 4, label: 'Unpaid leave' },
];

const DAY_TYPES = [
  { value: 1, label: 'Full day' },
  { value: 2, label: 'Half day' },
];

const getTotalDays = (from, to, type) => {
  if (!from || !to) return 0;
  if (type === 2) return 0.5;

  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

  return diff > 0 ? diff : 0;
};

// Normalise the various date shapes coming from the API to an <input type="date"> value.
const toInputDate = (value) => {
  if (!value) return '';
  if (typeof value === 'string') {
    const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (iso) return `${iso[1]}-${iso[2].padStart(2, '0')}-${iso[3].padStart(2, '0')}`;

    const dmy = value.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
    if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
  }

  const date = new Date(value);
  if (isNaN(date)) return '';
  return date.toISOString().slice(0, 10);
};

const UpdateLeave = ({ leave, Close, LeaveUpdated }) => {
  const from = toInputDate(leave.from);
  const to = toInputDate(leave.to) || from;

  const [form, setForm] = useState({
    leave_type: Number(leave.leave_type) || 1,
    type: Number(leave.type) || 1,
    from_date: from,
    to_date: to,
    reason: leave.reason || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isHalfDay = form.type === 2;
  const totalDays = getTotalDays(form.from_date, form.to_date, form.type);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: name === 'leave_type' || name === 'type' ? Number(value) : value,
      };

      if (name === 'from_date' && updated.to_date < value) {
        updated.to_date = value;
      }
      if (updated.type === 2) {
        updated.to_date = updated.from_date;
      }
      return updated;
    });

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (totalDays <= 0) {
      setError('To date cannot be before from date.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await update_leave({
        id: leave._id,
        leave_type: form.leave_type,
        type: form.type,
        from: form.from_date,
        to: form.to_date,
        reason: form.reason,
      });

      toast.success(result?.message || 'Leave updated successfully');
      if (LeaveUpdated) LeaveUpdated(leave._id, result, form);
      Close();
    } catch (err) {
      toast.error(err.message || 'Unable to update leave');
      setError(err.message || 'Unable to update leave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <motion.div
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, ease: 'linear' }}
        className="modal-panel max-w-xl"
      >
        {/* Header */}
        <div className="modal-header pl-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="modal-icon">
              <CalendarDays style={{ width: 20, height: 20, color: 'white' }} />
            </div>
            <div className="min-w-0">
              <h1 className="modal-title">Update leave request</h1>
              <p className="text-sm text-[#94A3B8]">Change the details before Admin/HR reviews it</p>
            </div>
          </div>
          <button type="button" onClick={() => Close()} className="modal-close" aria-label="Close">
            <X className="text-[#64748B]" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5 px-5 py-5">
          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">Leave type *</label>
              <select name="leave_type" value={form.leave_type} onChange={handleChange} className="modal-select" required>
                {LEAVE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">Day type *</label>
              <select name="type" value={form.type} onChange={handleChange} className="modal-select" required>
                {DAY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label className="modal-label">{isHalfDay ? 'Date *' : 'From *'}</label>
              <input
                name="from_date"
                value={form.from_date}
                onChange={handleChange}
                className="modal-input"
                type="date"
                required
              />
            </div>
            <div className="modal-field">
              <label className="modal-label">To *</label>
              <input
                name="to_date"
                value={form.to_date}
                onChange={handleChange}
                min={form.from_date}
                disabled={isHalfDay}
                className="modal-input disabled:cursor-not-allowed disabled:opacity-50"
                type="date"
                required
              />
            </div>
          </div>

          <div className="w-full">
            <label className="modal-label">Total days</label>
            <input
              value={totalDays ? `${totalDays} ${totalDays === 1 ? 'day' : 'days'}` : ''}
              readOnly
              tabIndex={-1}
              placeholder="Calculated from the dates"
              className="modal-input cursor-not-allowed bg-[#F1F5F9] placeholder:text-[#9CA3AF]"
              type="text"
            />
          </div>

          <div className="w-full">
            <label className="modal-label">Reason *</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={3}
              placeholder="Write the reason for your leave"
              className="modal-input resize-none"
              required
            />
          </div>

          <div className={`modal-info !mx-0 ${error ? 'border-red-200 bg-red-50' : ''}`}>
            <Info
              className="mt-0.5 shrink-0"
              style={{ width: 15, height: 15, color: error ? '#DC2626' : '#4F8EF7' }}
            />
            <p className={error ? 'text-red-600' : ''}>
              {error || 'You can edit this request while it is still pending approval.'}
            </p>
          </div>

          <div className="modal-footer -mx-5">
            <div className="modal-footer-row">
              <p className="text-sm text-[#6B7280]">*Required fields</p>
              <div className="modal-actions">
                <button type="button" onClick={() => Close()} className="modal-cancel">Cancel</button>
                <button type="submit" disabled={loading} className="modal-primary">
                  {loading ? 'Updating...' : 'Update leave'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateLeave;
