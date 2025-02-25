import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StudentDashboard.module.css';
import { API_URL } from '../../config/config';
import StudentSidebar from '../../components/StudentSidebar';
import Header from '../../components/Header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function StudentDashboard() {
  const navigate = useNavigate();
  const [assignedExams, setAssignedExams] = useState([]);
  const currentUserId = 1; // We'll keep this for now, but ideally should come from auth

  // Fetch assigned exams from the database
  const fetchAssignedExams = async () => {
    try {
      const response = await fetch(`${API_URL}/exams`);
      if (!response.ok) {
        throw new Error('Failed to fetch exams');
      }
      const exams = await response.json();
      
      // Filter exams assigned to the current student
      const userExams = exams.filter(exam => 
        exam.assigned_to === currentUserId
      );
      
      setAssignedExams(userExams);
    } catch (error) {
      console.error('Error fetching assigned exams:', error);
    }
  };

  useEffect(() => {
    fetchAssignedExams();
  }, []);

  const startExam = (examId) => {
    navigate(`/student/exam/${examId}`);
  };

  return (
    <div className={styles.main}>
      <div className={styles.sidebarContainer}>
        <StudentSidebar />
      </div>
      <div className={styles.contentArea}>
        <Header />
        <div className={styles.contentWrapper}>
          <div className={styles.breadcrumbContainer}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/student/dashboard">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>My Exams</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <h1 className={styles.title}>My Exams</h1>
          <div className={styles.examList}>
            {assignedExams.map((exam) => (
              <div key={exam.exam_id} className={styles.examCard}>
                <h3>{exam.title}</h3>
                <p>{exam.description}</p>
                <p>Duration: {exam.duration} minutes</p>
                <button onClick={() => startExam(exam.exam_id)}>
                  Start Exam
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard; 