import React from 'react';
import styles from './StudentAnnounce.module.css';
import StudentSidebar from '../../components/StudentSidebar';
import Header from '../../components/Header';
import Dashboard from '../../components/Dashboard';
import VisitorCards from '../../components/VisitorCards';
import { Bar } from 'react-chartjs-2';
import Announce from '../../components/Announce';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


function StudentAnnouncement() {

  return (
    <div className={styles.main}>
      <div className={styles.sidebarContainer}>
        <StudentSidebar />
      </div>
      <div className={styles.contentArea}>
      <div className={styles.headerWrapper}>
          <Header />
        </div>
        <div className={styles.contentWrapper}>
                  <div className={styles.breadcrumbContainer}>
                  <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage> Announcements</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          </div>
          <Announce />
     
          


        </div>
      </div>
    </div>
  );
}

export default StudentAnnouncement;
