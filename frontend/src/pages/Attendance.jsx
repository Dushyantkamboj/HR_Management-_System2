import { UserRound, Monitor, Eye, Search } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import AddAttendance from '../components/AddAttendance'
import Cookies from 'js-cookie'
import { list_attendance } from '../api/attendance/listAttendance.js'

// Check-ins after this time are counted as "Late"
const LATE_AFTER = { hour: 9, minute: 30 }

// Set this to your total number of employees to count people with
// no record today as absent. Keep 0 to count only status 2 records.
const TOTAL_EMPLOYEES = 0

const CARDS = [
  {
    id: 1,
    key: "present",
    Description: "Present",
    bg: "#F0FDF4",
    icon: <UserRound style={{ width: 20, height: 20, color: '#16A34A' }} />,
  },
  {
    id: 2,
    key: "late",
    Description: "Late arrivals",
    bg: "#FFFBEB",
    icon: <UserRound style={{ width: 20, height: 20, color: '#D97706' }} />,
  },
  {
    id: 3,
    key: "absent",
    Description: "Absent",
    bg: "#FFF1F2",
    icon: <UserRound style={{ width: 20, height: 20, color: '#E11D48' }} />,
  },
  {
    id: 4,
    key: "remote",
    Description: "Remote",
    bg: "#EFF6FF",
    icon: <Monitor style={{ width: 20, height: 20, color: '#2563EB' }} />,
  },
]

const USER_TYPES = {
  1: "Admin",
  2: "Manager",
  3: "Employee",
}

const STATUS = {
  1: { label: "Present", pill: "bg-green-50 text-green-600", dot: "bg-green-500" },
  2: { label: "Absent", pill: "bg-red-50 text-red-600", dot: "bg-red-500" },
  3: { label: "Leave", pill: "bg-purple-50 text-purple-600", dot: "bg-purple-500" },
}

// ---------- Helpers ----------

// "30-9-2026 16:30" -> Date
const parseDateTime = (value) => {
  if (!value || typeof value !== "string") return null

  const [datePart, timePart] = value.trim().split(" ")
  if (!datePart || !timePart) return null

  const [day, month, year] = datePart.split("-").map(Number)
  const [hour, minute] = timePart.split(":").map(Number)

  const d = new Date(year, month - 1, day, hour, minute)
  return isNaN(d) ? null : d
}

const getTime = (value) => {
  const d = parseDateTime(value)
  if (!d) return "-"
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

const getDate = (value) => {
  const d = parseDateTime(value)
  if (!d) return "-"
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const getTotalHours = (checkIn, checkOut) => {
  const start = parseDateTime(checkIn)
  const end = parseDateTime(checkOut)
  if (!start || !end) return "-"

  const minutes = Math.round((end - start) / 60000)
  if (minutes < 0) return "-"

  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

const getInitials = (name) => {
  if (!name) return "?"
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")
}

// Pull the array out of the API response
const extractList = (response) => {
  const list = response?.data?.data?.attendance || response?.data?.data || []
  return Array.isArray(list) ? list : []
}

// Today's card numbers from the attendance list
const getStats = (list, totalEmployees = 0) => {
  const today = new Date().toDateString()

  const presentIds = new Set()
  const lateIds = new Set()
  const remoteIds = new Set()
  const leaveIds = new Set()
  const absentIds = new Set()

  list.forEach((item) => {
    const recordDate = parseDateTime(item.check_in)
    if (!recordDate || recordDate.toDateString() !== today) return

    const id = item.userId || item._id

    if (item.status === 2) { absentIds.add(id); return }
    if (item.status === 3) { leaveIds.add(id); return }

    presentIds.add(id)

    const isLate =
      recordDate.getHours() > LATE_AFTER.hour ||
      (recordDate.getHours() === LATE_AFTER.hour &&
        recordDate.getMinutes() > LATE_AFTER.minute)

    if (isLate) lateIds.add(id)
    if (item.is_remote || item.remote) remoteIds.add(id)
  })

  // Employees with no record today are counted as absent
  const absent = totalEmployees
    ? Math.max(totalEmployees - presentIds.size - leaveIds.size, 0)
    : absentIds.size

  return {
    present: presentIds.size,
    late: lateIds.size,
    absent,
    remote: remoteIds.size,
  }
}

// ---------- Component ----------

const Attendance = () => {

  const type = parseInt(Cookies.get('type'))

  const [isFormopen, setisFormopen] = useState(false)
  const [attendance, setAttendance] = useState([])   // table
  const [statsList, setStatsList] = useState([])     // cards (all records)
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)

  // Search
  const [search, setSearch] = useState("")

  const stats = useMemo(
    () => getStats(statsList, TOTAL_EMPLOYEES),
    [statsList]
  )

  // Search by name / email / role / date / status
  const filteredAttendance = useMemo(() => {

    const q = search.trim().toLowerCase()
    if (!q) return attendance

    return attendance.filter((item) => {

      const user = item.userDetails || {}

      const haystack = [
        user.name,
        user.email,
        USER_TYPES[user.type],
        getDate(item.check_in),
        STATUS[item.status]?.label,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return haystack.includes(q)

    })

  }, [attendance, search])

  // Table data
  const getAttendance = async () => {
    try {
      setLoading(true)
      const response = await list_attendance({ page: 1, limit: 10 })
      if (response?.data?.status === 1) setAttendance(extractList(response))
    } catch (error) {
      console.log("Attendance list error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Card data (not limited to the table's 10 rows)
  const getTodayStats = async () => {
    try {
      setStatsLoading(true)
      const response = await list_attendance({ page: 1, limit: 1000 })
      if (response?.data?.status === 1) setStatsList(extractList(response))
    } catch (error) {
      console.log("Stats error:", error)
    } finally {
      setStatsLoading(false)
    }
  }

  // Refresh table + cards together
  const refreshAll = () => {
    getAttendance()
    getTodayStats()
  }

  useEffect(() => {
    refreshAll()
  }, [])

  // Eye button click (add your view logic here)
  const handleView = (item) => {
    console.log("View attendance:", item)
  }

  return (
    <div>

      {/* Header */}
      <div className="flex max-w-7xl mx-auto justify-between items-start mt-5">

        <div className="max-w-80 ml-4">
          <h1 className="font-semibold text-2xl tracking-tight">Attendance</h1>
          <p className="text-[#94A3B8] text-sm">
            View and manage employee attendance records
          </p>
        </div>

        {type !== 1 && type !== 2 &&
          <button
            onClick={() => setisFormopen(true)}
            className="min-w-30 py-2 px-2 flex justify-center items-center shadow-md mr-4 bg-[#6C63FF] text-white border border-[#6C63FF] rounded-xl transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:bg-indigo-600 font-semibold focus:outline-none"
          >
            Add Attendance
          </button>
        }

        {isFormopen && (
          <AddAttendance
            Close={() => setisFormopen(false)}
            getAttendance={refreshAll}
          />
        )}

      </div>

      {/* Cards (Admin / HR only) */}
      {type !== 3 &&
        <div className="grid grid-cols-4 gap-4 mt-8 max-w-7xl mx-auto ml-4 z-20">

          {CARDS.map((items) => (

            <div
              key={items.id}
              className="flex flex-col gap-5 border border-[#E2E4ED] bg-[#FFFFFF] rounded-xl max-w-100 min-h-30 transition-shadow hover:shadow-md"
            >

              <div className='flex justify-between items-center mt-3 pr-2'>

                <span className='text-[#A0A3B8] text-sm font-medium ml-2'>
                  {items.Description}
                </span>

                <div
                  className='border w-8 h-8 flex justify-center items-center rounded-lg'
                  style={{ backgroundColor: items.bg, borderColor: items.bg }}
                >
                  {items.icon}
                </div>

              </div>

              <p className='text-black text-3xl font-bold font-sans ml-2'>
                {statsLoading ? "-" : stats[items.key]}
              </p>

            </div>

          ))}

        </div>
      }

      {/* Search */}
      <div className='flex gap-3 max-w-7xl mx-auto mt-8 ml-4'>

        <div className='relative flex items-center w-full'>

          <Search
            size={18}
            className='absolute left-3 text-[#A0A3B8] pointer-events-none'
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='border w-full pl-10 rounded-xl py-2.5 transition-all border-[#E2E4ED] bg-[#FFFFFF] placeholder:text-[#A0A3B8] focus:outline-none focus:border-indigo-600 focus:shadow-md focus:shadow-indigo-200 text-sm'
            type="text"
            placeholder='Search attendance...'
          />

        </div>

      </div>

      {/* Attendance Table */}
      <div className='mt-8 ml-4 max-w-7xl mx-auto'>

        <table className='rounded-2xl border shadow-sm bg-[#FFFFFF] border-[#E2E4ED] table-auto overflow-hidden w-full'>

          <thead>
            <tr className='border-b border-[#E2E4ED] bg-[#FAFBFF]'>
              {["Employee", "Date", "Check in", "Check out", "Total hours", "Status", "Actions"].map((h, i) => (
                <th
                  key={h}
                  className={`py-3 uppercase text-sm font-semibold text-[#A0A3B8] ${i === 0 ? 'text-left pl-6' : 'text-center'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan="7" className="text-center py-8 text-[#94A3B8]">
                  Loading attendance...
                </td>
              </tr>

            ) : filteredAttendance.length === 0 ? (

              <tr>
                <td colSpan="7" className="text-center py-8 text-[#94A3B8]">
                  {attendance.length === 0
                    ? "No attendance records found"
                    : "No records match your search"}
                </td>
              </tr>

            ) : (

              filteredAttendance.map((item, index) => {

                const name = item.userDetails?.name
                const status = STATUS[item.status]

                return (

                  <tr
                    key={item._id || index}
                    className='border-b border-[#E2E4ED] hover:bg-[#FAFBFF]'
                  >

                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>

                        <div className='w-11 h-11 shrink-0 rounded-full bg-[linear-gradient(135deg,#8B7CF6,#6C63FF)] text-white flex justify-center items-center font-semibold text-sm'>
                          {getInitials(name)}
                        </div>

                        <div className='flex flex-col'>
                          <span className='font-semibold text-[#0F172A]'>
                            {name || "-"}
                          </span>
                          <span className='text-sm text-[#94A3B8]'>
                            {USER_TYPES[item.userDetails?.type] || "-"}
                          </span>
                        </div>

                      </div>
                    </td>

                    <td className='text-center px-5 py-4 text-[#64748B] text-sm'>
                      {getDate(item.check_in)}
                    </td>

                    <td className='text-center px-5 py-4 font-semibold text-[#0F172A] text-sm'>
                      {getTime(item.check_in)}
                    </td>

                    <td className='text-center px-5 py-4 font-semibold text-[#0F172A] text-sm'>
                      {getTime(item.check_out)}
                    </td>

                    <td className='text-center px-5 py-4 font-semibold text-[#475569] text-sm'>
                      {getTotalHours(item.check_in, item.check_out)}
                    </td>

                    <td className='text-center px-5 py-4'>
                      {status ? (
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${status.pill}`}>
                          <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                          {status.label}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* Actions: Eye only */}
                    <td className='text-center px-5 py-4'>
                      <button
                        type="button"
                        onClick={() => handleView(item)}
                        title="View"
                        className='w-10 h-10 inline-flex justify-center items-center border border-[#E2E4ED] rounded-xl text-[#64748B] hover:bg-[#F8FAFC]'
                      >
                        <Eye size={18} />
                      </button>
                    </td>

                  </tr>

                )

              })

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Attendance