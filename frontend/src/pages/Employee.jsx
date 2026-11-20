import { Outlet } from "react-router-dom";
import { list_employee } from "../api/user/listUser";
import { useState, useEffect, useRef } from "react";
import {UserRound, Check, UserRoundMinus, CreditCard, Search, Trash, Pencil} from "lucide-react";
import AddEmployee from "../components/AddEmployee";
import DeleteEmployee from "../components/DeleteEmployee";
import EditEmployee from "../components/EditEmployee";
import { getRandomRGB } from "../randomColor";

const Employee = () => {
  const [tableArr, setTablearr] = useState([]);
  const [isFormopen, setisFormopen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [deleteEmployeeName, setDeleteEmployeeName] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("default");
  const [status, setStatus] = useState("default");
  const requestIdRef = useRef(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalEmployees: 0,
    totalPages: 1,
  });

  const bgColor = getRandomRGB();

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

const getEmployees = async () => {

  const requestId = ++requestIdRef.current;

  try {

    const result = await list_employee(
      pagination.currentPage,
      10,
      search,
      department,
      status
    );

    console.log(
      "Employee API result:",
      result
    );

    if (!result?.status || requestId !== requestIdRef.current) {
      return;
    }

    setTablearr(
      result.data.employees
    );

    setPagination(
      result.data.pagination
    );

  } catch (error) {

    console.log(
      "Employee list error:",
      error
    );

  }
};



  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handleFilterChange = (setter) => (event) => {
    setter(event.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };


  // const handleEmployeeAdded = (newEmployee) => {
  //   console.log(newEmployee, "new");
  //   setTablearr((oldEmployee) => [newEmployee, ...oldEmployee]);
  // };
  const handleEmployeeAdded = (newEmployee) => {

  setTablearr((prev) => [
    newEmployee,
    ...prev,
  ]);
};
  const handleEmployeeDelete = (id) => {

  setTablearr((prev) =>
    prev.filter(
      (employee) =>
        employee._id !== id
    )
  );
};

const handleEmployeeUpdated = (updatedEmployee) => {

  setTablearr((prev) =>
    prev.map((employee) =>
      employee._id === updatedEmployee._id
        ? updatedEmployee
        : employee
    )
  );
};

useEffect(() => {
  getEmployees();
}, [pagination.currentPage, search, department, status]);

  const activeEmployee = tableArr.filter((total) => {
    return total.status === 1;
  });

  const inactiveEmployee = tableArr.filter((total) => {
    return total.status !== 1;
  });

  const data = [
    {
      id: 1,
      Description: "Total Employee",
      icon: <UserRound style={{ width: 20, height: 20, color: "#6C63FF" }} />,
      number: tableArr.length,
    },
    {
      id: 2,
      Description: "Active",
      icon: (
        <div className="ring w-3 h-3 rounded-full bg-[#16a34a] ring-sky-50 flex justify-center items-center">
          <Check
            style={{ width: 10, height: 10, color: "white" }}
            strokeWidth={3}
          />
        </div>
      ),
      number: activeEmployee.length,
    },
    {
      id: 3,
      Description: "Inactive",
      icon: (
        <UserRoundMinus style={{ width: 20, height: 20, color: "#d97706" }} />
      ),
      number: inactiveEmployee.length,
    },
    {
      id: 4,
      Description: "Departments",
      icon: <CreditCard style={{ width: 20, height: 20, color: "#dc2626" }} />,
      number: "7",
    },
  ];

  return (
    <>
      <div className="page-header">
        <div className="min-w-0">
          <h1 className="page-title">Employees</h1>
          <p className="text-[#6B6D8A]">
            {tableArr.length} teams members accross 7 departments
          </p>
        </div>
        <button
          onClick={() => setisFormopen(true)}
          className="primary-btn"
        >
          + Add Employee
        </button>
        {isFormopen && (
          <AddEmployee
            EmployeeAdded={handleEmployeeAdded}
            Close={() => setisFormopen(false)}
          />
        )}
      </div>
      <div className="stat-grid">
        {data.map((items) => {
          return (
            <div
              key={items.id}
              className="stat-card"
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
          );
        })}
      </div>
      <div className="filter-bar">
        <div className="relative flex w-full items-center">
          <Search className="absolute left-3 text-[#A0A3B8]" size={20} />
          <input
            className="search-input"
            type="text"
            value={search}
            onChange={handleFilterChange(setSearch)}
            placeholder="Search name,role,email..."
          />
        </div>
        <select
          className="filter-select"
          value={department}
          onChange={handleFilterChange(setDepartment)}
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
          className="filter-select"
          value={status}
          onChange={handleFilterChange(setStatus)}
        >
          <option value="default">All Statuses</option>
          <option value="Active">Active</option>
          <option value="InActive">In Active</option>
        </select>
      </div>
      <div className="table-shell">
        <table className="data-table min-w-[900px]">
          <thead>
            <tr className="border-b border-[#E2E4ED] bg-[#FAFBFF]">
              <th className="th-cell">
                Employee Name
              </th>
              <th className="th-cell">
                Department
              </th>
              <th className="th-cell">
                Phone
              </th>
              <th className="th-cell">
                Location
              </th>
              <th className="th-cell">
                Joined
              </th>
              <th className="th-cell">
                Role
              </th>
              <th className="th-cell">
                Status
              </th>
              <th className="th-cell">
                Salary
              </th>
              <th className="th-cell">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {tableArr.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="td-cell text-center text-[#6B6D8A] py-10"
                >
                  No employees match your search.
                </td>
              </tr>
            )}
            {tableArr.map((employee) => {
              const isActive = employee.status === 1;

              return (
                <tr
                  key={employee._id}
                  className="border-b border-[#E2E4ED] hover:bg-[#FAFBFF] px-2"
                >
                  <td className="pl-5 py-5">
                    <div className="flex items-center gap-2 text-left">
                      <p
                        className="w-10 h-10 flex justify-center items-center ring rounded-full px-2 py-2 text-md text-white  font-bold"
                        style={{ backgroundColor: bgColor }}
                      >
                        {" "}
                        {getInitials(employee.name)}
                      </p>
                      <div>
                        <p>{employee.name}</p>
                        <p className="text-sm text-[#6B6D8A]">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="td-cell">
                    {employee.department}
                  </td>
                  <td className="td-cell">{employee.phone}</td>
                  <td className="td-cell">{employee.location}</td>
                  <td className="td-cell text-[#6B6D8A]">
                    {employee.joining_date}
                  </td>
                  <td className="td-cell">
                    {employee.type === 2 ? "HR" : "Employee"}
                  </td>
                  <td className="flex justify-center items-center px-5 py-4">
                    <div
                      className={`mt-3 border rounded-2xl flex justify-center items-center gap-2 w-20 ${
                        isActive
                          ? "border-green-100 bg-green-50"
                          : "border-orange-100 bg-orange-50"
                      }`}
                    >
                      <span className="relative flex size-2">
                        <span
                          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                            isActive ? "bg-green-500" : "bg-orange-500"
                          }`}
                        ></span>
                        <span
                          className={`relative inline-flex size-2 rounded-full ${
                            isActive ? "bg-green-500" : "bg-[#F59E0B]"
                          }`}
                        ></span>
                      </span>
                      <p
                        className={`font-semibold text-sm py-1 ${
                          isActive ? "text-[#15803D]" : "text-[#B45309]"
                        }`}
                      >
                        {isActive ? "Active" : "In Active"}
                      </p>
                    </div>
                  </td>
                  <td className="td-cell font-medium text-[#1A1A2E]">
                    ${employee.salary}
                  </td>
                  <td className="flex gap-4 justify-center items-center ">
                    <div className="flex gap-2 mr-2">
                      <button
                        onClick={() => setEditEmployee(employee)}
                        className="border w-10 h-8 bg-sky-50 flex items-center justify-center rounded-lg border-sky-50"
                      >
                        <Pencil
                          style={{ width: 15, height: 15, color: "blue" }}
                        />
                      </button>

                      <button
                        onClick={() => {
                          setDeleteEmployeeId(employee._id);
                          setDeleteEmployeeName(employee.name);
                        }}
                        className="border w-10 h-8 bg-red-100 flex items-center justify-center rounded-lg border-red-100"
                      >
                        <Trash
                          style={{ width: 15, height: 15, color: "red" }}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(pagination.totalEmployees >= 10 || pagination.totalPages > 1) && (
          <div className="mt-4 mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#6B6D8A]">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, index) => index + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg border ${
                    pagination.currentPage === page
                      ? "bg-[#6C63FF] text-white border-[#6C63FF]"
                      : "bg-white text-black border-[#E2E4ED]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* edit employee ka form open hoga age editEmployee true hoga */}

        {editEmployee && (
          <EditEmployee
            employeeId={editEmployee._id}
            employeeData={editEmployee}
            EmployeeUpdated={handleEmployeeUpdated}
            Close={() => setEditEmployee(null)}
          />
        )}

        {/* delete employee ka form open hoga age deleteEmployeeId true hogi */}

        {deleteEmployeeId && (
          <DeleteEmployee
            deleteEmployee={handleEmployeeDelete}
            name={deleteEmployeeName}
            employeeId={deleteEmployeeId}
            Close={() => {
              setDeleteEmployeeId(null);
              setDeleteEmployeeName("");
            }}
          />
        )}
      </div>
      <Outlet />
    </>
  );
};

export default Employee;
