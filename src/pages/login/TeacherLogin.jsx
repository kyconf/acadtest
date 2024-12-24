import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginBox from '../../components/LoginBox';
import styles from './TeacherLogin.module.css';



function TeacherLogin() {
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


  
  return (
    <div className={styles.con}>
     
        <LoginBox />
      
  </div>
  
  );
}

export default TeacherLogin;
