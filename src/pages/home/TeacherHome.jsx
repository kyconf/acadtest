import React from 'react';
import styles from './TeacherHome.module.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Dashboard from '../../components/Dashboard';
import VisitorCards from '../../components/VisitorCards';
import { Chart } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function TeacherHome() {

  return (
    <div className={styles.main}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
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
      <BreadcrumbPage>Dashboard</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
</div>
          <Dashboard />
          <VisitorCards />
        

          <div className={styles.graphcontainer}>
            <div className={styles.graph}>
              <h1> Exam 1: SAT Practice </h1>
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