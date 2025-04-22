import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setCredentials({ ...credentials, username: savedUsername });
      setRememberMe(true);
    }
  }, []);

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5096/api/admin/login', credentials);
      toast.success('Login successful');
      localStorage.setItem('adminToken', res.data.token); // assume backend sends token
      
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', credentials.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }

      setTimeout(() => navigate('/admin/dashboard'), 1000);
    } catch (err) {
      toast.error('Invalid username or password');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Admin Login</h3>
        <form onSubmit={handleLogin}>
          <input name="username" placeholder="Username" onChange={handleChange} value={credentials.username} className="form-control mb-3" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} value={credentials.password} className="form-control mb-3" />
          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="rememberMe" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember Me
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="text-center mt-3">
          <a href="#" onClick={() => toast.info('Forgot Password functionality coming soon.')}>Forgot Password?</a>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default AdminLogin;
