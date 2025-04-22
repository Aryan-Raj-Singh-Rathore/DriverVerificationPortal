import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from './Components/AdminDashboard';
import AdminLogin from './Components/AdminLogin';
import DriverRegister from './Components/DriverRegister';
import DriverStatusCheck from './Components/DriverStatus';
import FaceVerification from './Components/FaceVerification';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Driver Verification System</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register Driver</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/status">Check Status</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin Panel</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/face-verification">Face Verification</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<DriverRegister />} />
            <Route path="/register" element={<DriverRegister />} />
            <Route path="/status" element={<DriverStatusCheck />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/face-verification" element={<FaceVerification />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
