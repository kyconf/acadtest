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
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-notebook-pen"><path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/></svg>
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