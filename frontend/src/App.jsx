import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import Login from './pages/Login';
import EmployeeLogin from './pages/EmployeeLogin';
import Layout from './Layout/Layout';
import Dashboard from './pages/Dashboard';
import Employee from './pages/Employee';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Events from './pages/Events';
import RolePermission from './pages/RolePermission';
import MyProfile from './pages/MyProfile';
// import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRoute from './components/protectedRoute';
import UserContextProvider from './context/context';


function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/admin/login" element={<Login />} />
          <Route path='/login' element={<EmployeeLogin />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/leaves" element={<Leaves />} />
              <Route path="/events" element={<Events />} />
              <Route path="/role&permissions" element={<RolePermission />} />
              <Route path="/myprofile" element={<MyProfile />} />
            </Route>
          </Route>
        </Routes>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;