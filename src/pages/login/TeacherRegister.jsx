import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';





function LoginPage() {
  const navigate = useNavigate();

  const navButton = () => {
      navigate('/teacher'); // Replace '/start-learning' with your desired route
  };


  // State for form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // State for displaying success or error messages
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    try {
      const response = await fetch('/a-register', { //port 3000 /a-register
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message); // Show success message
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`); // Show error message
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred.');
    }
  };

  
  return (
    <div className="registerPage">
    <h1>Register</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Register</button>
    </form>
    <button onClick={navButton}>Login</button>

    {/* Display success or error messages */}
    {message && <p>{message}</p>}
  </div>
  
  );
}

export default LoginPage;
