import { Outlet } from "react-router-dom";
import { list_employee } from "../api/user/listUser";
import { useState, useEffect } from "react";
import {
  UserRound,
  Check,
  UserRoundMinus,
  CreditCard,
  Search,
  Trash,
  Pencil,
} from "lucide-react";
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

  try {

    const result = await list_employee(
      pagination.currentPage,
      10
    );

    console.log(
      "Employee API result:",
      result
    );

    if (!result?.status) {
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
},[pagination.currentPage]);

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
      <div className="flex max-w-7xl max-auto justify-between items-start mt-5">
        <div className="max-w-80 ml-4">
          <h1 className="font-semibold text-2xl tracking-tight">Employees</h1>
          <p className="text-[#6B6D8A]">
            {tableArr.length} teams members accross 7 departments
          </p>
        </div>
        <button
          onClick={() => setisFormopen(true)}
          className="min-w-40 py-2  flex justify-center items-center shadow-md mr-4 bg-[#6C63FF] text-white border border-[#6C63FF] rounded-xl transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:bg-indigo-600  font-semibold focus:outline-none"
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
      <div className="grid grid-cols-4 gap-4 mt-8 max-w-7xl max-auto ml-4 z-20">
        {data.map((items) => {
          return (
            <div
              key={items.id}
              className="flex flex-col gap-5 border border-[#E2E4ED] bg-[#FFFFFF] rounded-xl max-w-90 min-h-30 transition-shadow hover:shadow-md"
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
      <div className="flex gap-3 max-w-7xl mx-auto  mt-8 ml-4">
        <div className="relative flex items-center w-full">
          <Search className="absolute ml-2 text-[#A0A3B8]" size={20} />
          <input
            className="border w-full pl-10 rounded-xl py-2.5 transition-all border-[#E2E4ED] bg-[#FFFFFF] placeholder:text-[#A0A3B8] focus:outline-none focus:border-indigo-600 focus:shadow-md focus:shadow-indigo-200 text-sm"
            type="text"
            placeholder="Search name,role,email..."
          />
        </div>
        <select className="border rounded-xl text-[#A0A3B8]  border-[#E2E4ED] bg-[#FFFFFF] focus:outline-none text-sm px-3 py-2.5 hover:cursor-pointer">
          <option value="default">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Operations">Operations</option>
        </select>
        <select className="border rounded-xl text-[#A0A3B8]  border-[#E2E4ED] bg-[#FFFFFF] focus:outline-none text-sm px-3 py-2.5 hover:cursor-pointer">
          <option value="default">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Active">In Active</option>
        </select>
      </div>
      <div className="mt-8 ml-4 max-w-7xl mx-auto ">
        <table className="rounded-2xl border shadow-sm bg-[#FFFFFF] border-[#E2E4ED] table-auto overflow-hidden w-full ">
          <thead>
            <tr className="border-b border-[#E2E4ED] bg-[#FAFBFF]">
              <th className="text-center py-2 uppercase text-sm font-semibold text-[#A0A3B8]">
                Employee Name
              </th>
              <th className="text-center py-2 uppercase text-sm font-semibold text-[#A0A3B8]">
                Department
              </th>
              <th className="text-center py-2 uppercase text-sm font-semibold text-[#A0A3B8]">
                Phone
              </th>
              <th className="text-center py-2 uppercase text-sm font-semibold text-[#A0A3B8]">
                Location
              </th>
              <th className="text-center py-2 uppercase text-sm font-semibold text-[#A0A3B8]">
                Joined
              </th>
              <th className="text-center py-2 uppercase text-sm font-semibold text-[#A0A3B8]">
                Role
              </th>
              <th className="text-center py-2 uppercase text-sm font-semibold text-[#A0A3B8]">
                Status
              </th>
              <th className="text-center py-2 uppercase text-sm font-semibold text-[#A0A3B8]">
                Salary
              </th>
              <th className="text-center py-2 uppercase text-sm font-semibold text-[#A0A3B8]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
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
                  <td className="text-center px-5 py-4">
                    {employee.department}
                  </td>
                  <td className="text-center px-5 py-4">{employee.phone}</td>
                  <td className="text-center px-5 py-4">{employee.location}</td>
                  <td className="text-center px-5 py-4 text-[#6B6D8A]">
                    {employee.joining_date}
                  </td>
                  <td className="text-center px-5 py-4">
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
                  <td className="text-center px-5 py-4 text-[#1A1A2E] font-medium">
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
        {pagination.totalEmployees >= 10 && (
          <div className="flex justify-between items-center mt-4 mb-5">
            <p className="text-sm text-[#6B6D8A]">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>

            <div className="flex gap-2">
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
