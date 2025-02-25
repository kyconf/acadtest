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

  // Add the fetchAssignedExams function
  const fetchAssignedExams = async (examIds) => {
    try {
      // For now, we'll use mock data since we're using local storage
      const mockExams = [
        { 
          exam_id: 1, 
          title: "SAT Practice Test 1", 
          description: "Reading and Writing Section" 
        },
        { 
          exam_id: 2, 
          title: "SAT Practice Test 2", 
          description: "Math Section" 
        },
        { 
          exam_id: 3, 
          title: "SAT Practice Test 3", 
          description: "Full Test" 
        }
      ];

      // Filter mock exams based on assigned exam IDs
      const userExams = mockExams.filter(exam => 
        examIds.includes(exam.exam_id.toString())
      );
      
      setAssignedExams(userExams);
    } catch (error) {
      console.error('Error fetching assigned exams:', error);
    }
  };

  useEffect(() => {
    // Get assignments from local storage
    const assignments = JSON.parse(localStorage.getItem('examAssignments') || '{}');
    const currentUserId = 1; // Mock current student ID
    
    // Get all exams that are assigned to this student
    const userAssignedExams = Object.entries(assignments)
      .filter(([_, assignment]) => assignment.students.includes(currentUserId))
      .map(([examId]) => examId);

    // Fetch exam details for assigned exams
    fetchAssignedExams(userAssignedExams);
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