import { useState, useEffect } from "react";
import {
  Calendar,
  UsersRound,
  CalendarCheck,
  Pencil,
  Trash2,
  MapPin,
  UserRound,
} from "lucide-react";

import AddEvent from "../components/AddEvent.jsx";
import EditEvent from "../components/EditEvent.jsx";
import DeleteEvent from "../components/DeleteEvent.jsx";

import Cookies from "js-cookie";

import { list_event } from "../api/event/listEvent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const type = parseInt(Cookies.get("type"));

const Events = () => {

  const [tableArr, settableArr] = useState([]);
  const [isFormopen, setisFormopen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [deleteEventData, setDeleteEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalevents: 0,
  });

  // ==============================
  // GET EVENT LIST
  // ==============================

  const getEvents = async () => {

    try {

      setLoading(true);

      const response = await list_event(page, limit);

      if (response.data.status === 1) {

        settableArr(response.data.data.employees || []);

        setPagination(
          response.data.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalevents: 0,
          }
        );

      } else {

        toast.error(
          response.data.message || "Unable to fetch events"
        );

      }

    } catch (error) {

      console.log("Event list error:", error);

      toast.error(
        error.response?.data?.message ||
        "Unable to fetch events"
      );

    } finally {

      setLoading(false);

    }
  };


  // ==============================
  // LOAD EVENTS
  // ==============================

  useEffect(() => {

    getEvents();

  }, [page]);


  // ==============================
  // AFTER ADD EVENT
  // ==============================

  const handleEventAdded = () => {

    setPage(1);

    getEvents();

  };


  // ==============================
  // UPDATE EVENT IN TABLE
  // ==============================

  const handleUpdateEvent = (updatedEvent) => {

    settableArr((prev) =>
      prev.map((item) =>
        item._id === updatedEvent.eventId
          ? {
              ...item,
              ...updatedEvent,
            }
          : item
      )
    );

  };


  // ==============================
  // DELETE EVENT FROM TABLE
  // ==============================

  const handleDeleteEvent = (eventId) => {

    settableArr((prev) =>
      prev.filter((item) => item._id !== eventId)
    );

  };


  // ==============================
  // SEARCH
  // ==============================

  const filteredEvents = tableArr.filter((event) => {

    const searchValue = search.toLowerCase();

    return (
      event.title?.toLowerCase().includes(searchValue) ||
      event.category?.toLowerCase().includes(searchValue) ||
      event.location?.toLowerCase().includes(searchValue) ||
      event.organizer?.toLowerCase().includes(searchValue)
    );

  });


  // ==============================
  // STATUS
  // ==============================

  const getStatus = (status) => {

    switch (Number(status)) {

      case 0:
        return {
          text: "Upcoming",
          className: "bg-blue-50 text-blue-600",
        };

      case 1:
        return {
          text: "Completed",
          className: "bg-green-50 text-green-600",
        };

      case 2:
        return {
          text: "Cancelled",
          className: "bg-red-50 text-red-600",
        };

      default:
        return {
          text: "Unknown",
          className: "bg-gray-50 text-gray-600",
        };

    }

  };


  // ==============================
  // FORMAT DATE
  // ==============================

  const formatDate = (date) => {

    if (!date) return "";

    const dateObj = new Date(date);

    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  };


  // ==============================
  // CARD DATA
  // ==============================

  const upcomingCount = tableArr.filter(
    (item) => Number(item.status) === 0
  ).length;

  const completedCount = tableArr.filter(
    (item) => Number(item.status) === 1
  ).length;

  const categories = new Set(
    tableArr.map((item) => item.category)
  ).size;


  const data = [
    {
      id: 1,
      Description: "Upcoming events",
      icon: (
        <Calendar
          style={{
            width: 20,
            height: 20,
            color: "#6C63FF",
          }}
        />
      ),
      number: upcomingCount,
    },
    {
      id: 2,
      Description: "Completed events",
      icon: (
        <UsersRound
          style={{
            width: 20,
            height: 20,
            color: "#6C63FF",
          }}
        />
      ),
      number: completedCount,
    },
    {
      id: 3,
      Description: "Event categories",
      icon: (
        <CalendarCheck
          style={{
            width: 20,
            height: 20,
            color: "#EC4899",
          }}
        />
      ),
      number: categories,
    },
  ];


  return (
    <div>

      <ToastContainer />


      {/* ================= HEADER ================= */}

      <div className="flex max-w-7xl mx-auto justify-between items-start mt-5">

        <div className="max-w-80 ml-4">

          <h1 className="font-semibold text-2xl tracking-tight">
            Events
          </h1>

          <p className="text-[#6B6D8A]">
            {pagination.totalevents || 0} events
          </p>

        </div>


        {type !== 3 && (

          <button
            onClick={() => setisFormopen(true)}
            className="min-w-30 py-2 flex justify-center items-center shadow-md mr-4 bg-[#6C63FF] text-white border border-[#6C63FF] rounded-xl transition duration-300 hover:-translate-y-1 hover:bg-indigo-600 font-semibold focus:outline-none"
          >
            + Add Event
          </button>

        )}


        {isFormopen && (

          <AddEvent
            Close={() => setisFormopen(false)}
            eventAdded={handleEventAdded}
          />

        )}

      </div>


      {/* ================= CARDS ================= */}

      <div className="grid grid-cols-3 gap-4 mt-8 max-w-7xl mx-auto ml-4 z-20">

        {data.map((items) => (

          <div
            key={items.id}
            className="flex flex-col gap-5 border border-[#E2E4ED] bg-[#FFFFFF] rounded-xl max-w-100 min-h-30 transition-shadow hover:shadow-md"
          >

            <div className="flex justify-between items-center mt-3 pr-2">

              <span className="text-[#A0A3B8] text-sm font-medium ml-2">
                {items.Description}
              </span>

              <div className="border w-8 h-8 flex justify-center items-center rounded-lg bg-sky-50 border-sky-50">
                {items.icon}
              </div>

            </div>

            <p className="text-black text-3xl font-bold font-sans ml-2">
              {items.number}
            </p>

          </div>

        ))}

      </div>


      {/* ================= SEARCH ================= */}

      <div className="flex gap-3 max-w-7xl mx-auto mt-8 ml-4">

        <div className="relative flex items-center w-full">

          <input
            className="border w-full pl-4 rounded-xl py-2.5 transition-all border-[#E2E4ED] bg-[#FFFFFF] placeholder:text-[#A0A3B8] focus:outline-none focus:border-indigo-600 focus:shadow-md focus:shadow-indigo-200 text-sm"
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>


      {/* ================= TABLE ================= */}

      <div className="mt-8 ml-4 max-w-7xl mx-auto overflow-x-auto">

        <table className="rounded-2xl border shadow-sm bg-[#FFFFFF] border-[#E2E4ED] table-auto overflow-hidden w-full">

          <thead>

            <tr className="border-b border-[#E2E4ED] bg-[#FAFBFF]">

              <th className="text-left px-5 py-4 uppercase text-sm font-semibold text-[#A0A3B8]">
                Event
              </th>

              <th className="text-left px-5 py-4 uppercase text-sm font-semibold text-[#A0A3B8]">
                Date & Time
              </th>

              <th className="text-left px-5 py-4 uppercase text-sm font-semibold text-[#A0A3B8]">
                Location
              </th>

              <th className="text-left px-5 py-4 uppercase text-sm font-semibold text-[#A0A3B8]">
                Organizer
              </th>

              <th className="text-center px-5 py-4 uppercase text-sm font-semibold text-[#A0A3B8]">
                Attendees
              </th>

              <th className="text-center px-5 py-4 uppercase text-sm font-semibold text-[#A0A3B8]">
                Status
              </th>

              {type !== 3 && (

                <th className="text-center px-5 py-4 uppercase text-sm font-semibold text-[#A0A3B8]">
                  Action
                </th>

              )}

            </tr>

          </thead>


          <tbody>

            {/* LOADING */}

            {loading ? (

              <tr>

                <td
                  colSpan={type !== 3 ? 7 : 6}
                  className="text-center py-10 text-gray-500"
                >
                  Loading events...
                </td>

              </tr>

            ) : filteredEvents.length === 0 ? (

              <tr>

                <td
                  colSpan={type !== 3 ? 7 : 6}
                  className="text-center py-10 text-gray-500"
                >
                  No events found
                </td>

              </tr>

            ) : (

              filteredEvents.map((event) => {

                const status = getStatus(event.status);

                return (

                  <tr
                    key={event._id}
                    className="border-b border-[#E2E4ED] hover:bg-[#FAFBFF]"
                  >

                    {/* EVENT */}

                    <td className="px-5 py-5">

                      <div>

                        <p className="font-semibold text-gray-800">
                          {event.title}
                        </p>

                        <span className="inline-block mt-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs text-indigo-600">
                          {event.category}
                        </span>

                      </div>

                    </td>


                    {/* DATE */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <Calendar
                          size={18}
                          className="text-indigo-500"
                        />

                        <div>

                          <p className="text-sm font-medium text-gray-700">
                            {formatDate(event.date)}
                          </p>

                          <p className="text-xs text-gray-400">
                            {event.starts} - {event.ends}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* LOCATION */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-sm text-[#6B6D8A]">

                        <MapPin
                          size={16}
                          className="text-gray-400"
                        />

                        {event.location}

                      </div>

                    </td>


                    {/* ORGANIZER */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-sm text-[#6B6D8A]">

                        <UserRound
                          size={16}
                          className="text-gray-400"
                        />

                        {event.organizer}

                      </div>

                    </td>


                    {/* ATTENDEES */}

                    <td className="text-center px-5 py-4">

                      <div className="flex justify-center items-center gap-2 text-[#6B6D8A]">

                        <UsersRound size={16} />

                        {event.attendees}

                      </div>

                    </td>


                    {/* STATUS */}

                    <td className="text-center px-5 py-4">

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                      >

                        <span className="h-1.5 w-1.5 rounded-full bg-current" />

                        {status.text}

                      </span>

                    </td>


                    {/* ACTION */}

                    {type !== 3 && (

                      <td className="text-center px-5 py-4">

                        <div className="flex justify-center gap-2">

                          {/* EDIT */}

                          <button
                            onClick={() => setEditEvent(event)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-indigo-500 hover:bg-indigo-50"
                            title="Edit"
                          >
                            <Pencil size={17} />
                          </button>


                          {/* DELETE */}

                          <button
                            onClick={() =>
                              setDeleteEventData(event)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    )}

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>


      {/* ================= PAGINATION ================= */}
{pagination.totalEvents >= 10 && (
      <div className="flex justify-end items-center gap-3 mt-5 mr-4">

        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {pagination.currentPage || page} of{" "}
          {pagination.totalPages || 1}
        </span>

        <button
          disabled={page >= (pagination.totalPages || 1)}
          onClick={() => setPage((prev) => prev + 1)}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
        >
          Next
        </button>

      </div>
)}


      {/* ================= EDIT MODAL ================= */}

      {editEvent && (

        <EditEvent
          event={editEvent}
          Close={() => setEditEvent(null)}
          updateEvent={handleUpdateEvent}
        />

      )}


      {/* ================= DELETE MODAL ================= */}

      {deleteEventData && (

        <DeleteEvent
          eventId={deleteEventData._id}
          name={deleteEventData.title}
          Close={() => setDeleteEventData(null)}
          deleteEvent={handleDeleteEvent}
        />

      )}

    </div>
  );
};

export default Events;