import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import logo1 from '../assets/logo1.png';

function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navButton = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.logoCon}>
          <img className={styles.logo1} src={logo1} alt="logo" />
        </div>

        <button 
          className={`${styles.button} ${
            location.pathname === '/student/dashboard' ? styles.active : ''
          }`} 
          onClick={() => navButton('/student/dashboard')}
        >
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="1.2rem" height="1.2rem" viewBox="0 0 512.000000 512.000000"
            preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
              fill="currentColor" stroke="none">
              <path d="M2443 4479 c-34 -4 -88 -18 -120 -31 -60 -25 -2003 -1151 -2059 -1193..." />
            </g>
          </svg>
          My Exams
        </button>

        <button 
          className={`${styles.button} ${
            location.pathname === '/announcements' ? styles.active : ''
          }`}
          onClick={() => navButton('/announcements')}
        >
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="1.2rem" height="1.2rem" viewBox="0 0 512.000000 512.000000"
            preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
              fill="currentColor" stroke="none">
              <path d="M3895 4971 c-37 -17 -51 -38 -184 -267 -152 -262 -163 -293..." />
            </g>
          </svg>
          Announcements
        </button>

        <button className={styles.new} onClick={() => navButton('/')}>Log out</button>
      </div>
    </div>
  );
}

export default StudentSidebar; 