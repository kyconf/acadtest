import React from 'react';
import styles from './AnnouncePage.module.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Dashboard from '../../components/Dashboard';
import VisitorCards from '../../components/VisitorCards';
import { Bar } from 'react-chartjs-2';
import Announce from '../../components/Announce';

function AnnouncePage() {

  return (
    <div className={styles.main}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={styles.contentArea}>
        <Header />
        
        <div className={styles.contentWrapper}>
          <Announce />
     
          


        </div>
      </div>
    </div>
  );
}

export default AnnouncePage;
