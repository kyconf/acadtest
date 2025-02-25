import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginBox.module.css'
import student from '../assets/student.svg';
import barcode from '../assets/barcode.png';
import { API_URL } from '../config/config';


function LoginBox() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  
  const navButton = () => {
      navigate('/a-register'); // Replace '/start-learning' with your desired route
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Check username to determine if student
        if (formData.username === 'john_doe' || formData.username === 'jane_doe') {
          navigate('/student/dashboard'); // Redirect to student dashboard
        } else {
          navigate('/dashboard'); // Teacher dashboard
        }
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An unexpected error occurred.');
    }
  };

  
  return (
    <div className={styles.loginBox}>
    <div className={styles.hole}></div>
    <img className={styles.student} src={student} alt="student" draggable="false" />
    <form onSubmit={handleSubmit}>
      <div className={styles.wrap}>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.wrap} >
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button className={styles.login}type="submit">sign In</button>
    </form>
    <p className={styles.createAcc} onClick={navButton}>create a new account </p>

    {message && <p className={styles.message}>{message}</p>}
    <div className={styles.bar}>
    <img className={styles.barcode} src={barcode} alt="barcode" draggable="false" />
    </div>
    
  </div>
  
  
  );
}

export default LoginBox;
