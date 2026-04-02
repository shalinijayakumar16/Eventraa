import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Bootstrap import

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import DeptLogin from "./pages/DeptLogin";
import DeptDashboard from "./pages/DeptDashboard";
import StudentDashboard from "./pages/StudentDashboard";



function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/dept-login" element={<DeptLogin />} />
        <Route path="/dept-dashboard" element={<DeptDashboard />} />

        <Route path="/student" element={<StudentDashboard />} />
        

      </Routes>
    </div>
  );
}

export default App;