import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default to 'user'
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (role === 'admin') {
      // Admin login logic
      if (username === 'admin' && password === 'admin123') {
        navigate('/dashboard');
      } else {
        alert('Admin login failed');
      }
    } else {
      // User login logic
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert('User logged in successfully!');
          navigate('/user/form');
        } else {
          alert(data.error || 'Login failed');
        }
      } catch (error) {
        alert('Server error');
      }
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      
      <div className="role-selection">
        <label>
          <input
            type="radio"
            name="role"
            value="admin"
            checked={role === 'admin'}
            onChange={() => setRole('admin')}
          />
          Admin Login
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="user"
            checked={role === 'user'}
            onChange={() => setRole('user')}
          />
          User Login
        </label>
      </div>
      
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
