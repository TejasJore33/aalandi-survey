import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './frontend/pages/Login';
import AdminDashboard from './frontend/pages/AdminDashboard';
import UserForm from './frontend/pages/UserForm';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/user/form" element={<UserForm />} />
      </Routes>
    </Router>
  );
}

export default App;
