import { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';

const pad = (n) => String(n).padStart(2, '0');

const HOURS = Array.from({ length: 12 }, (_, index) => String(index + 1));
const MINUTES = Array.from({ length: 60 }, (_, index) => pad(index));
const PERIODS = ['AM', 'PM'];

// Value is stored as 24-hour "HH:mm" so the backend receives the same
// format it got from the native <input type="time">.
const to12Hour = (value) => {
  if (typeof value !== 'string') return { hour: '', minute: '', period: '' };

  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return { hour: '', minute: '', period: '' };

  const hour24 = Number(match[1]);
  if (hour24 > 23 || Number(match[2]) > 59) {
    return { hour: '', minute: '', period: '' };
  }

  return {
    hour: String(hour24 % 12 === 0 ? 12 : hour24 % 12),
    minute: match[2],
    period: hour24 >= 12 ? 'PM' : 'AM',
  };
};

const to24Hour = (hour, minute, period) => {
  if (!hour || !minute || !period) return '';

  let hour24 = Number(hour) % 12;
  if (period === 'PM') hour24 += 12;

  return `${pad(hour24)}:${minute}`;
};

const TimePicker = ({ name, value, onChange, placeholder = 'Select time' }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const lastEmittedRef = useRef(value);

  const initial = to12Hour(value);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState(initial.period);

  // Keep the picker in sync when the parent resets or loads a value,
  // but ignore the echo of a value we just emitted ourselves.
  useEffect(() => {
    if (value === lastEmittedRef.current) return;

    const next = to12Hour(value);
    setHour(next.hour);
    setMinute(next.minute);
    setPeriod(next.period);
    lastEmittedRef.current = value;
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const update = (nextHour, nextMinute, nextPeriod) => {
    setHour(nextHour);
    setMinute(nextMinute);
    setPeriod(nextPeriod);

    // Mirror the native input's event shape so existing handleChange works.
    // A partial selection stays local until hour, minute and period are set.
    const result = to24Hour(nextHour, nextMinute, nextPeriod);
    lastEmittedRef.current = result;
    onChange({ target: { name, value: result } });
  };

  const clear = () => {
    setHour('');
    setMinute('');
    setPeriod('');
    lastEmittedRef.current = '';
    onChange({ target: { name, value: '' } });
    setOpen(false);
  };

  const display = hour && minute && period
    ? `${hour}:${minute} ${period}`
    : placeholder;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="modal-input flex w-full items-center justify-between gap-2 text-left"
        aria-expanded={open}
      >
        <span className={hour && minute && period ? '' : 'text-[#94A3B8]'}>
          {display}
        </span>
        <Clock size={15} className="shrink-0 text-[#94A3B8]" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-full rounded-xl border border-[#E2E4ED] bg-white p-3 shadow-lg">
          <div className="grid grid-cols-3 gap-2">
            <select
              aria-label="Hour"
              value={hour}
              onChange={(event) => update(event.target.value, minute, period)}
              className="modal-select px-2 text-sm"
            >
              <option value="">Hour</option>
              {HOURS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select
              aria-label="Minute"
              value={minute}
              onChange={(event) => update(hour, event.target.value, period)}
              className="modal-select px-2 text-sm"
            >
              <option value="">Min</option>
              {MINUTES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select
              aria-label="AM or PM"
              value={period}
              onChange={(event) => update(hour, minute, event.target.value)}
              className="modal-select px-2 text-sm"
            >
              <option value="">--</option>
              {PERIODS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={clear}
            className="mt-2 w-full rounded-lg py-1 text-xs font-medium text-[#64748B] hover:bg-[#F1F5F9]"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
