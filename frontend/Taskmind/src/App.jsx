import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/Auth/signup";
import Login from "./pages/Auth/login";
import Dashboard from "./pages/Admin/dashboard";
import Createtask from "./pages/Admin/Createtask";
import ManageUsers from "./pages/Admin/manageusers";
import ManageTasks from "./pages/Admin/managetasks";
import UserDashboard from "./pages/Users/userdashboard";
import MyTasks from "./pages/Users/mystasks";
import PrivateRoutes from "./routes/privateroutes";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4aed88',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Admin Routes */}
            <Route element={<PrivateRoutes allowedRoles="admins" />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/createtask" element={<Createtask />} />
              <Route path="/admin/manageusers" element={<ManageUsers />} />
              <Route path="/admin/managetasks" element={<ManageTasks />} />
            </Route>
            
            {/* User Routes */}
            <Route element={<PrivateRoutes allowedRoles="users" />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/mystasks" element={<MyTasks />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;