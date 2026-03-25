import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ResumeUpload from "./ResumeUpload";
import Dashboard from "./Dashboard";

function App() {
  const [refreshDashboard, setRefreshDashboard] = useState(false);

  const triggerDashboardRefresh = () => {
    setRefreshDashboard(!refreshDashboard); // toggle to trigger useEffect
  };

  return (
    <Router>
      <div className="p-6">
        <nav className="mb-6">
          <Link to="/" className="mr-4 font-semibold text-blue-600">Upload Resume</Link>
          <Link to="/dashboard" className="font-semibold text-blue-600">Dashboard</Link>
        </nav>

        <hr className="mb-6" />

        <Routes>
          <Route path="/" element={<ResumeUpload onUpload={triggerDashboardRefresh} />} />
          <Route path="/dashboard" element={<Dashboard refresh={refreshDashboard} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;