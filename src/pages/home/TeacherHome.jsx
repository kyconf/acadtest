import React from 'react';
import styles from './TeacherHome.module.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Dashboard from '../../components/Dashboard';
import VisitorCards from '../../components/VisitorCards';
import { Chart } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

function TeacherHome() {
  return (
    <div className={styles.main}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={styles.contentArea}>
        <Header />
        
        <div className={styles.contentWrapper}>
          <Dashboard />
          <VisitorCards />
          
          <div className={styles.graphcontainer}>
            <div className={styles.graph}>
              <h1> Recent Exams: Exam 1 </h1>
              <Bar 
              data={{
                labels: ['S1M1 R&W', 'S1M2 R&W', 'S2M1 Math', 'S2M2 Math'],
                datasets: [{
                  label: 'Average score per module',
                  backgroundColor: 'rgb(86, 145, 255)',
                  borderColor: 'rgb(86, 145, 255)',
                  borderRadius: 8,
                  barThickness: 75,
                  data: [66, 96, 56, 70]
                }]
              }}
              />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherHome;
