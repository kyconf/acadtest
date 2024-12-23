import React from 'react';
import styles from './TeacherHome.module.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

function TeacherHome() {
  return (
    <div className={styles.main}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={styles.contentArea}>
        <Header />
        <div className={styles.contentWrapper}>
          <div className={styles.dashboard}>
            <h2>Dashboard</h2>
          </div>
          <div className={styles.wrapper2}>
            {[...Array(8)].map((_, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.content}>
                  <p className={styles.heading}>Card {index + 1}</p>
                  <p className={styles.para}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi laboriosam
                    at voluptas minus culpa deserunt delectus sapiente inventore pariatur.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherHome;
