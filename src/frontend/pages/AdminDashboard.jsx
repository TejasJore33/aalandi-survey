import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('users');
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [formDataList, setFormDataList] = useState([]);
  const [popupMsg, setPopupMsg] = useState('');
  const navigate = useNavigate(); // for logout navigation

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      showPopup('Error fetching users');
    }
  };

  const fetchFormData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/form-data');
      const data = await response.json();
      setFormDataList(data);
    } catch (error) {
      showPopup('Error fetching form data');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showPopup = (msg) => {
    setPopupMsg(msg);
    setTimeout(() => setPopupMsg(''), 3000);
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok) {
        showPopup('User added successfully!');
        setUsers((prev) => [...prev, data.user]);
        setNewUser({ username: '', password: '' });
        setActiveView('users');
      } else {
        showPopup(data.error || 'Error adding user');
      }
    } catch (error) {
      showPopup('Server error');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Admin Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      {popupMsg && <div className="popup">{popupMsg}</div>}

      <div className="button-group spaced">
        <button onClick={() => { setActiveView('formData'); fetchFormData(); }}>Show Data</button>
        <button onClick={() => { setActiveView('users'); fetchUsers(); }}>Show Users</button>
        <button onClick={() => setActiveView('addUser')}>Add User</button>
      </div>

      {activeView === 'users' && (
        <div>
          <h3>Users List</h3>
          <table className="full-width-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeView === 'addUser' && (
        <div>
          <h3>Add New User</h3>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              placeholder="Username"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Password"
            />
          </div>

          <button onClick={handleAddUser}>Add User</button>
        </div>
      )}

      {activeView === 'formData' && (
        <div className="form-data-table">
          <h3>Submitted Form Data</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="full-width-table">
              <thead>
                <tr>
                  <th>Ward No</th>
                  <th>House No</th>
                  <th>Resident Name</th>
                  <th>Mobile No</th>
                  <th>Address</th>
                  <th>Total Households</th>
                  <th>Property Type</th>
                  <th>Details</th>
                  <th>Industry Type</th>
                  <th>Water Connection</th>
                  <th>Authorized Connections</th>
                  <th>Connection Diameters</th>
                  <th>Property Photo</th>
                  <th>Pipeline Photo</th>
                  <th>Water Tax Bill</th>
                </tr>
              </thead>
              <tbody>
                {formDataList.map((form, index) => (
                  <tr key={index}>
                    <td>{form.wardNo}</td>
                    <td>{form.houseNo}</td>
                    <td>{form.residentName}</td>
                    <td>{form.mobileNo}</td>
                    <td>{form.address}</td>
                    <td>{form.totalHouseholds}</td>
                    <td>{form.propertyType}</td>
                    <td>{form.propertyTypeDetails.join(', ')}</td>
                    <td>{form.industryType}</td>
                    <td>{form.municipalWaterConnection}</td>
                    <td>{form.authorizedWaterConnections.join(', ')}</td>
                    <td>{form.authorizedConnectionDiameter.join(', ')}</td>
                    <td><a href={`http://localhost:5000/${form.propertyPhoto}`} target="_blank" rel="noreferrer">View</a></td>
                    <td><a href={`http://localhost:5000/${form.pipelinePhoto}`} target="_blank" rel="noreferrer">View</a></td>
                    <td><a href={`http://localhost:5000/${form.waterTaxBill}`} target="_blank" rel="noreferrer">View</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
