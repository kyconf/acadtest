import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminPage.module.css'
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Dashboard from '../../components/Dashboard';

function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.main}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={styles.contentArea}>
        <Header />
        <div className={styles.contentWrapper}>
          <Dashboard />
          <div className={styles.wrapper2}>
            <div className={styles.card}>
              <div className={styles.content}>
                <p className={styles.heading}>Card</p>
                <p className={styles.para}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi laboriosam
                  at voluptas minus culpa deserunt delectus sapiente inventore pariatur.
                </p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.content}>
                <p className={styles.heading}>Card</p>
                <p className={styles.para}>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi laboriosam
                  at voluptas minus culpa deserunt delectus sapiente inventore pariatur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
