import {
  Clock,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Check,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import AddLeave from '../components/AddLeaves'
import Cookies from 'js-cookie'
import { list_leave } from '../api/Leave/listLeave.js'
// import { update_leave_status } from '../api/Leave/updateLeaveStatus.js'

// Static part of the cards (numbers are calculated from leaves)
const CARDS = [
  {
    id: 1,
    key: "pending",
    Description: "Pending requests",
    Icon: Clock,
    color: '#D97706',
    bg: '#FFFBEB'
  },
  {
    id: 2,
    key: "approved",
    Description: "Approved",
    Icon: CheckCircle2,
    color: '#16A34A',
    bg: '#F0FDF4'
  },
  {
    id: 3,
    key: "rejected",
    Description: "Rejected",
    Icon: XCircle,
    color: '#E11D48',
    bg: '#FFF1F2'
  },
  {
    id: 4,
    key: "approvedDays",
    Description: "Approved days",
    Icon: CalendarDays,
    color: '#4F8EF7',
    bg: '#EFF6FF'
  },
]

// Rows per page options
const LIMIT_OPTIONS = [10, 20, 50]

// User types: 1 = Admin, 2 = HR, 3 = Employee
const ADMIN = 1
const HR = 2
const EMPLOYEE = 3

// Leave status values sent to the backend
const LEAVE_STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
}

// leave_type labels: 1 Sick, 2 Casual, 3 Annual, 4 Unpaid
const LEAVE_TYPES = {
  1: "Sick Leave",
  2: "Casual Leave",
  3: "Annual Leave",
  4: "Unpaid Leave",
}

// Leave status labels
const STATUS = {
  1: {
    label: "Pending",
    pill: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500"
  },
  2: {
    label: "Approved",
    pill: "bg-green-50 text-green-600",
    dot: "bg-green-500"
  },
  3: {
    label: "Rejected",
    pill: "bg-red-50 text-red-600",
    dot: "bg-red-500"
  },
}

// userDetails.type labels (fallback when there is no department)
const USER_TYPES = {
  1: "Admin",
  2: "HR",
  3: "Employee",
}

// ---------- Helpers ----------

// "2026-09-30", "30-9-2026" or ISO date -> Date object
const parseDate = (value) => {
  if (!value) return null

  if (value instanceof Date) {
    return isNaN(value) ? null : value
  }

  if (typeof value === "string") {
    const text = value.trim()

    // yyyy-mm-dd (works with time too)
    const iso = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
    if (iso) {
      return new Date(
        Number(iso[1]),
        Number(iso[2]) - 1,
        Number(iso[3])
      )
    }

    // dd-mm-yyyy
    const dmy = text.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/)
    if (dmy) {
      return new Date(
        Number(dmy[3]),
        Number(dmy[2]) - 1,
        Number(dmy[1])
      )
    }
  }

  const d = new Date(value)
  return isNaN(d) ? null : d
}

// First available value from the item
const pick = (item, keys) => {
  for (const k of keys) {
    if (item?.[k]) return item[k]
  }

  return null
}

// First 8 hex characters of a MongoDB _id = creation time (fallback)
const dateFromObjectId = (id) => {
  if (typeof id !== "string" || !/^[a-f0-9]{24}$/i.test(id)) {
    return null
  }

  return new Date(parseInt(id.substring(0, 8), 16) * 1000)
}

// Applied date: date fields first, then _id
const getAppliedDate = (item) =>
  pick(item, [
    "createdAt",
    "created_at",
    "created_date",
    "createdOn",
    "applied_date",
    "applied_on",
    "appliedAt",
    "apply_date",
    "date",
    "updatedAt",
  ]) || dateFromObjectId(item?._id)

// Date -> "Sep 23"
const shortDate = (d) =>
  d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  })

// Date -> "Sep 12, 2026"
const fullDate = (value) => {
  const d = parseDate(value)

  if (!d) return "-"

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}

// From and To dates
const getRange = (item) => {
  const from = parseDate(
    pick(item, [
      "from_date",
      "fromDate",
      "start_date",
      "startDate",
      "from"
    ])
  )

  const to =
    parseDate(
      pick(item, [
        "to_date",
        "toDate",
        "end_date",
        "endDate",
        "to"
      ])
    ) || from

  return { from, to }
}

// Total leave days (number): half day = 0.5
const getLeaveDays = (item) => {
  const { from, to } = getRange(item)

  if (!from) return 0

  if (Number(item.type) === 2) return 0.5

  const diff =
    Math.round(
      (to - from) / (1000 * 60 * 60 * 24)
    ) + 1

  return diff > 0 ? diff : 1
}

// Duration: "Sep 23 – Sep 27" and below it "5 days" / "Half day"
const getDuration = (item) => {
  const { from, to } = getRange(item)

  if (!from) {
    return {
      range: "-",
      days: ""
    }
  }

  const range =
    from.getTime() === to.getTime()
      ? shortDate(from)
      : `${shortDate(from)} – ${shortDate(to)}`

  if (Number(item.type) === 2) {
    return {
      range,
      days: "Half day"
    }
  }

  const total = getLeaveDays(item)

  return {
    range,
    days: `${total} ${total === 1 ? "day" : "days"}`
  }
}

// "Diana Okonkwo" -> "DO"
const getInitials = (name) => {
  if (!name) return "?"

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")
}

// ---------- Component ----------

const Leaves = () => {

  const type = parseInt(Cookies.get('type'))

  // Only Admin (1) and HR (2) can approve or reject
  const isReviewer = type === ADMIN || type === HR

  const [isFormopen, setisFormopen] = useState(false)
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(false)

  // Tracks which leave is being approved/rejected right now
  const [processingId, setProcessingId] = useState(null)

  // Pagination
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)

  // List Leave API (page and limit are sent to the backend)
  const getLeaves = async () => {

    try {

      setLoading(true)

      const response = await list_leave({
        page,
        limit
      })

      console.log("Leave List Response:", response)

      if (response?.data?.status === 1) {

        const list =
          response?.data?.data?.leaves ||
          response?.data?.data?.leave ||
          response?.data?.data ||
          []

        setLeaves(
          Array.isArray(list) ? list : []
        )

        // Total records (if the backend sends it)
        setTotal(
          Number(
            response?.data?.total ??
            response?.data?.totalCount ??
            response?.data?.data?.total ??
            response?.data?.data?.totalCount ??
            0
          )
        )
      }

    } catch (error) {

      console.log("Leave list error:", error)

    } finally {

      setLoading(false)

    }

  }

  // Reload the list when page or limit changes
  useEffect(() => {
    getLeaves()
  }, [page, limit])

  const totalPages =
    total > 0
      ? Math.ceil(total / limit)
      : null

  const hasNext =
    totalPages
      ? page < totalPages
      : leaves.length === limit

  const hasPrev = page > 1

  // Show pagination only when there is more than one page of records
  const showPagination =
    total > 0
      ? total > LIMIT_OPTIONS[0]
      : page > 1 || leaves.length >= limit

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value))
    setPage(1)
  }

  // Card numbers calculated from the leaves list
  const approvedLeaves = leaves.filter(
    (l) => Number(l.status) === LEAVE_STATUS.APPROVED
  )

  const approvedDays = approvedLeaves.reduce(
    (sum, l) => sum + getLeaveDays(l),
    0
  )

  const stats = {
    pending: leaves.filter(
      (l) => Number(l.status) === LEAVE_STATUS.PENDING
    ).length,

    approved: approvedLeaves.length,

    rejected: leaves.filter(
      (l) => Number(l.status) === LEAVE_STATUS.REJECTED
    ).length,

    approvedDays:
      Number.isInteger(approvedDays)
        ? approvedDays
        : approvedDays.toFixed(1),
  }

  // Approve / Reject (Admin and HR only)
  const updateStatus = async (item, newStatus) => {

    if (!isReviewer) return

    const actionText =
      newStatus === LEAVE_STATUS.APPROVED
        ? "approve"
        : "reject"

    const ok = window.confirm(
      `Are you sure you want to ${actionText} this leave request?`
    )

    if (!ok) return

    try {

      setProcessingId(item._id)

      const response = await update_leave_status({
        id: item._id,
        status: newStatus
      })

      console.log("Update leave status response:", response)

      if (response?.data?.status === 1) {

        // Reload the list so the row and the cards update
        await getLeaves()

      } else {

        alert(
          response?.data?.message ||
          `Failed to ${actionText} leave`
        )

      }

    } catch (error) {

      console.log("Update leave status error:", error)

      alert(`Something went wrong while trying to ${actionText} the leave`)

    } finally {

      setProcessingId(null)

    }

  }

  const handleApprove = (item) =>
    updateStatus(item, LEAVE_STATUS.APPROVED)

  const handleReject = (item) =>
    updateStatus(item, LEAVE_STATUS.REJECTED)

  const handleDelete = (item) => {
    console.log("Delete leave:", item)
  }

  return (
    <div>

      {/* Header */}

      <div className="flex max-w-7xl max-auto justify-between items-start mt-5">

        <div className="max-w-80 ml-4">

          <h1 className="font-semibold text-2xl tracking-tight">
            Leave requests
          </h1>

          <p className="text-[#94A3B8] text-sm">
            Review and manage employee time off
          </p>

        </div>

        {type === EMPLOYEE && (
          <button
            onClick={() => setisFormopen(true)}
            className="min-w-30 py-2 px-2 flex justify-center items-center shadow-md mr-4 bg-[#6C63FF] text-white border border-[#6C63FF] rounded-xl transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:bg-indigo-600 font-semibold focus:outline-none"
          >
            Apply for Leave
          </button>
        )}

        {isFormopen && (
          <AddLeave
            Close={() => setisFormopen(false)}
            getLeaves={getLeaves}
          />
        )}

      </div>


      {/* Cards (Admin / HR only) */}

      {type !== EMPLOYEE && (
        <div className="grid grid-cols-4 gap-4 mt-8 max-w-7xl max-auto ml-4 z-20">

          {CARDS.map((card) => {

            const Icon = card.Icon

            return (
              <div
                key={card.id}
                className="flex flex-col gap-5 border border-[#E2E4ED] bg-[#FFFFFF] rounded-xl max-w-100 min-h-30 transition-shadow hover:shadow-md"
              >

                <div className="flex justify-between items-center mt-3 pr-2">

                  <span className="text-[#A0A3B8] text-sm font-medium ml-2">
                    {card.Description}
                  </span>

                  <div
                    className="w-8 h-8 flex justify-center items-center rounded-lg"
                    style={{
                      backgroundColor: card.bg
                    }}
                  >
                    <Icon
                      style={{
                        width: 20,
                        height: 20,
                        color: card.color
                      }}
                    />
                  </div>

                </div>

                <p className="text-black text-3xl font-bold font-sans ml-2">
                  {loading ? "-" : stats[card.key]}
                </p>

              </div>
            )

          })}

        </div>
      )}


      {/* Search */}

      <div className="flex gap-3 max-w-7xl mx-auto mt-8 ml-4">

        <div className="relative flex-1 min-w-0">

          <input
            className="border w-full pl-10 rounded-xl py-2.5 transition-all border-[#E2E4ED] bg-[#FFFFFF] placeholder:text-[#A0A3B8] focus:outline-none focus:border-indigo-600 focus:shadow-md focus:shadow-indigo-200 text-sm"
            type="text"
            placeholder="Search name,role,email..."
          />

        </div>

        <select
          className="w-45 shrink-0 border rounded-xl text-[#A0A3B8] border-[#E2E4ED] bg-[#FFFFFF] focus:outline-none text-sm px-3 py-2.5 hover:cursor-pointer"
        >
          <option value="default">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
        </select>

        <select
          className="w-36 shrink-0 border rounded-xl text-[#A0A3B8] border-[#E2E4ED] bg-[#FFFFFF] focus:outline-none text-sm px-3 py-2.5 hover:cursor-pointer"
        >
          <option value="default">All Statuses</option>
          <option value="1">Pending</option>
          <option value="2">Approved</option>
          <option value="3">Rejected</option>
        </select>

      </div>


      {/* Leave Table */}

      <div className="mt-8 ml-4 max-w-7xl mx-auto">

        <table className="rounded-2xl border shadow-sm bg-[#FFFFFF] border-[#E2E4ED] table-auto overflow-hidden w-full">

          <thead>

            <tr className="border-b border-[#E2E4ED] bg-[#FAFBFF]">

              {[
                "Employee",
                "Leave Type",
                "Duration",
                "Reason",
                "Applied",
                "Status",
                "Action"
              ].map((h, i) => (

                <th
                  key={h}
                  className={`py-3 px-4 uppercase text-xs font-semibold tracking-wide text-[#A0A3B8] text-left ${
                    i === 0 ? 'pl-6' : ''
                  }`}
                >
                  {h}
                </th>

              ))}

            </tr>

          </thead>


          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="7"
                  className="text-center py-8 text-[#94A3B8]"
                >
                  Loading leaves...
                </td>
              </tr>

            ) : leaves.length === 0 ? (

              <tr>
                <td
                  colSpan="7"
                  className="text-center py-8 text-[#94A3B8]"
                >
                  No leave requests found
                </td>
              </tr>

            ) : (

              leaves.map((item, index) => {

                const name = item.userDetails?.name

                const status = STATUS[item.status]

                const duration = getDuration(item)

                const isPending =
                  Number(item.status) === LEAVE_STATUS.PENDING

                // Approve / Reject only for Admin or HR, and only while pending
                const canReview = isPending && isReviewer

                const isProcessing = processingId === item._id

                return (

                  <tr
                    key={item._id || index}
                    className="border-b border-[#E2E4ED] hover:bg-[#FAFBFF]"
                  >

                    {/* Employee */}

                    <td className="pl-6 pr-4 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 shrink-0 rounded-full bg-[#F7A261] text-white flex justify-center items-center font-semibold text-sm">
                          {getInitials(name)}
                        </div>

                        <div className="flex flex-col">

                          <span className="font-semibold text-[#0F172A]">
                            {name || "-"}
                          </span>

                          <span className="text-sm text-[#94A3B8]">
                            {
                              item.userDetails?.department ||
                              USER_TYPES[item.userDetails?.type] ||
                              "-"
                            }
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* Leave type */}

                    <td className="px-4 py-4">

                      {LEAVE_TYPES[item.leave_type] ? (

                        <span className="inline-block px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-semibold whitespace-nowrap">
                          {LEAVE_TYPES[item.leave_type]}
                        </span>

                      ) : (

                        "-"

                      )}

                    </td>


                    {/* Duration */}

                    <td className="px-4 py-4">

                      <div className="flex flex-col">

                        <span className="text-sm font-semibold text-[#334155] whitespace-nowrap">
                          {duration.range}
                        </span>

                        <span className="text-sm text-[#94A3B8]">
                          {duration.days}
                        </span>

                      </div>

                    </td>


                    {/* Reason */}

                    <td
                      className="px-4 py-4 text-sm text-[#64748B] max-w-52 truncate"
                      title={item.reason}
                    >
                      {item.reason || "-"}
                    </td>


                    {/* Applied */}

                    <td className="px-4 py-4 text-sm text-[#94A3B8] whitespace-nowrap">
                      {fullDate(getAppliedDate(item))}
                    </td>


                    {/* Status */}

                    <td className="px-4 py-4">

                      {status ? (

                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${status.pill}`}
                        >

                          <span
                            className={`w-2 h-2 rounded-full ${status.dot}`}
                          ></span>

                          {status.label}

                        </span>

                      ) : (

                        "-"

                      )}

                    </td>


                    {/* Actions: Approve / Reject / Delete */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2">

                        {canReview && (

                          <>

                            <button
                              type="button"
                              onClick={() => handleApprove(item)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                              <Check size={15} />

                              {isProcessing ? "Please wait..." : "Approve"}

                            </button>


                            <button
                              type="button"
                              onClick={() => handleReject(item)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                              <X size={15} />

                              Reject

                            </button>

                          </>

                        )}


                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          title="Delete"
                          className="w-9 h-9 inline-flex justify-center items-center border border-[#E2E4ED] bg-[#F8FAFC] rounded-lg text-[#64748B] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                        >

                          <Trash2 size={16} />

                        </button>

                      </div>

                    </td>

                  </tr>

                )

              })

            )}

          </tbody>

        </table>


        {/* Pagination */}

        {showPagination ? (

          <div className="flex justify-between items-center mt-4 mb-8">

            <div className="flex items-center gap-2 text-sm text-[#64748B]">

              <span>Per page</span>

              <select
                value={limit}
                onChange={handleLimitChange}
                className="border rounded-lg border-[#E2E4ED] bg-[#FFFFFF] focus:outline-none text-sm px-2 py-1.5 hover:cursor-pointer"
              >

                {LIMIT_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}

              </select>

            </div>


            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() => setPage((p) => p - 1)}
                disabled={!hasPrev || loading}
                className="w-9 h-9 flex justify-center items-center border border-[#E2E4ED] rounded-lg bg-[#FFFFFF] text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="text-sm text-[#64748B]">
                Page {page}
                {totalPages ? ` of ${totalPages}` : ""}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext || loading}
                className="w-9 h-9 flex justify-center items-center border border-[#E2E4ED] rounded-lg bg-[#FFFFFF] text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>

            </div>

          </div>

        ) : (

          <div className="mb-8" />

        )}

      </div>

    </div>
  )
}

export default Leaves