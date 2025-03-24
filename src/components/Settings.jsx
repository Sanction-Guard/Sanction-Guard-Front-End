import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../styles/Settings.css';
import img1 from '../img/avatar.png'; // Default profile image

function Settings() {
  // State for timezone settings
  const [timezone, setTimezone] = useState('UTC');
  const [date, setDate] = useState('2025-03-15');
  const [time, setTime] = useState('12:00');

  // State for dark/light mode
  const [theme, setTheme] = useState('light');

  // State for profile popup and user details
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe123',
    profileImage: img1,
  });
  const [editUserDetails, setEditUserDetails] = useState({ ...userDetails });

  // State for data source configuration
  const [dataSource, setDataSource] = useState('Local');

  // State for notification settings
  const [webAlerts, setWebAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  // Handlers for timezone settings
  const handleSaveTimezone = () => {
    Swal.fire({
      icon: 'success',
      title: 'Timezone Settings Saved!',
      text: `Timezone: ${timezone}, Date: ${date}, Time: ${time}`,
      confirmButtonColor: '#3085d6',
    });
  };

  // Handlers for dark/light mode
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    Swal.fire({
      icon: 'info',
      title: 'Theme Changed!',
      text: `You switched to ${theme === 'light' ? 'Dark' : 'Light'} mode.`,
      confirmButtonColor: '#3085d6',
    });
  };

  // Handlers for profile settings
  const handleEditChange = (e) => {
    setEditUserDetails({ ...editUserDetails, [e.target.name]: e.target.value });
  };

  // Handler for profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditUserDetails({ ...editUserDetails, profileImage: imageUrl });
    }
  };

  const handleSaveProfile = () => {
    setUserDetails({ ...editUserDetails });
    setShowProfilePopup(false);
    Swal.fire({
      icon: 'success',
      title: 'Profile Updated!',
      text: 'Your profile has been updated successfully.',
      confirmButtonColor: '#3085d6',
    });
  };

  const handleResetPassword = () => {
    Swal.fire({
      title: 'Send Password Reset?',
      text: 'A reset link will be sent to your email.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, send it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Sent!',
          text: 'Check your email for the reset link.',
          confirmButtonColor: '#3085d6',
        });
      }
    });
  };

  // Handler for data source selection
  const handleDataSourceChange = (e) => {
    setDataSource(e.target.value);
    Swal.fire({
      icon: 'success',
      title: 'Data Source Updated!',
      text: `You selected: ${e.target.value} database.`,
      confirmButtonColor: '#3085d6',
    });
  };

  return (
    <div className={`settings-container ${theme}`}>
      {/* Main Content Area */}
      <div className="settings-content">
        {/* Combined Section: Settings Title, Profile Info, and Theme Selector */}
        <div className="settings-title-card">
          <div className="settings-header">
            <h2>Settings</h2>
            <div className="header-actions">
              {/* Profile Icon */}
              <div className="profile-icon" onClick={() => setShowProfilePopup(true)}>
                <img src={userDetails.profileImage} alt="Profile" className="profile-image" />
              </div>
              {/* Theme Toggle Icon */}
              <div className="theme-toggle-icon" onClick={toggleTheme}>
                <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
              </div>
            </div>
          </div>
        </div>

        {/* Timezone Settings Card */}
        <div className="settings-card">
          <div className="settings-section">
            <h3>Timezone Settings</h3>
            <div className="settings-row">
              <label>Timezone:</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="PST">PST</option>
                <option value="GMT">GMT</option>
              </select>
            </div>
            <div className="settings-row">
              <label>Date:</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="settings-row">
              <label>Time:</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <button className="save-button" onClick={handleSaveTimezone}>
              Save Timezone Settings
            </button>
          </div>
        </div>

        {/* Data Source Configuration Card */}
        <div className="settings-card">
          <div className="settings-section">
            <h3>Data Source Configuration</h3>
            <div className="settings-row">
              <label>Select Database for Screening:</label>
              <select value={dataSource} onChange={handleDataSourceChange}>
                <option value="Local">Local</option>
                <option value="UN">UN</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings Card */}
        <div className="settings-card">
          <div className="settings-section">
            <h3>Notification Settings</h3>
            <div className="settings-row">
              <label>Web Alerts:</label>
              <input type="checkbox" checked={webAlerts} onChange={() => setWebAlerts(!webAlerts)} />
            </div>
            <div className="settings-row">
              <label>Email Alerts:</label>
              <input type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Popup */}
      {showProfilePopup && (
        <div className="profile-popup">
          <div className="profile-popup-content">
            <h3>Profile Settings</h3>
            <div className="profile-image-large">
              <img src={editUserDetails.profileImage} alt="Profile" className="profile-image" />
              <label className="image-upload-button">
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-upload-input"
                />
              </label>
            </div>
            <div className="profile-field">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editUserDetails.name}
                onChange={handleEditChange}
              />
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editUserDetails.email}
                onChange={handleEditChange}
              />
            </div>
            <div className="profile-field">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={editUserDetails.username}
                onChange={handleEditChange}
              />
            </div>
            <button className="reset-password-button" onClick={handleResetPassword}>
              Reset Password
            </button>
            <div className="profile-actions">
              <button className="save-button" onClick={handleSaveProfile}>
                Save
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowProfilePopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;