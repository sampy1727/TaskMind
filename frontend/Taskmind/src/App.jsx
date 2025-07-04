import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Signup from "./pages/Auth/signup";
import Login from "./pages/Auth/login";
import Dashboard from "./pages/Admin/dashboard";
import Createtask from "./pages/Admin/Createtask";
import ManageUsers from "./pages/Admin/manageusers";
import ManageTasks from "./pages/Admin/managetasks";
import UserDashboard from "./pages/Users/userdashboard";
import MyTasks from "./pages/Users/mystasks";
import PrivateRoutes from "./routes/privateroutes"; // Make sure this import path is correct

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Admin Routes */}
          <Route element={<PrivateRoutes allowedRoles={"admins"} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/createtask" element={<Createtask />} />
            <Route path="/admin/manageusers" element={<ManageUsers />} />
            <Route path="/admin/managetasks" element={<ManageTasks />} />
          </Route>
          {/* User Routes */}
          <Route element={<PrivateRoutes allowedRoles={"users"} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/mystasks" element={<MyTasks />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;