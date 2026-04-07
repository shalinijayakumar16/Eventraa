import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Bootstrap import

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import DeptLogin from "./pages/DeptLogin";
import DeptDashboard from "./pages/DeptDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/ToastContainer";



function App() {
  return (
    <ToastProvider>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/dept-login" element={<DeptLogin />} />
          <Route path="/dept-dashboard" element={<DeptDashboard />} />

          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          

        </Routes>
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

export default App;