import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/config';

import Sidebar from '../../components/Sidebar';
import styles from './CreatePage.module.css';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import Create from '../../components/Create';
import Header from '../../components/Header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


function CreatePage() {
  const navigate = useNavigate();

  // Navigate function
  const navButton = () => {
    navigate('/teacher'); // Replace with your desired route
  };



  const [exams, setExams] = useState([]); // State to store the list of exams
  const [error, setError] = useState(null); // State to handle errors
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 10; // You can adjust this number

  // Get current exams
  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = exams.slice(indexOfFirstExam, indexOfLastExam);

  // Calculate total pages
  const totalPages = Math.ceil(exams.length / examsPerPage);

  const [students, setStudents] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [assignedExams, setAssignedExams] = useState({});

  useEffect(() => {
    // Fetch students and exams
    const fetchData = async () => {
      try {
        const [studentsRes, examsRes] = await Promise.all([
          fetch(`${API_URL}/students`),
          fetch(`${API_URL}/exams`)
        ]);
        
        const studentsData = await studentsRes.json();
        const examsData = await examsRes.json();
        
        setStudents(studentsData);
        setExams(examsData);

        // Fetch assigned exams for each student
        const assignedData = {};
        await Promise.all(studentsData.map(async (student) => {
          const response = await fetch(`${API_URL}/assigned-exams/${student.id}`);
          const assignedExams = await response.json();
          assignedData[student.id] = assignedExams;
        }));
        setAssignedExams(assignedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleExamClick = (exam) => {
    setSelectedExam(exam);
    // Pre-select students who are already assigned to this exam
    const preSelectedStudents = students
      .filter(student => assignedExams[student.id]?.includes(exam.exam_id))
      .map(student => student.id);
    setSelectedStudents(preSelectedStudents);
  };

  // State for form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 0
  });

  // State for displaying success or error messages
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add state for alert message
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Add function to fetch exams
  const fetchExams = async () => {
    try {
      const response = await fetch(`${API_URL}/exams`);
      if (response.ok) {
        const data = await response.json();
        setExams(data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  // Use useEffect to fetch exams on component mount
  useEffect(() => {
    fetchExams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Add this to prevent form default submission

    try {
      const response = await fetch(`${API_URL}/exams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Show success message
        setAlert({
          show: true,
          message: 'Exam created successfully!',
          type: 'success'
        });

        // Clear form
        setFormData({
          title: '',
          description: '',
          duration: 0
        });

        // Fetch updated exams list
        fetchExams();

        // Hide alert after 3 seconds
        setTimeout(() => {
          setAlert({ show: false, message: '', type: '' });
        }, 3000);

      } else {
        const errorData = await response.json();
        setAlert({
          show: true,
          message: `Error: ${errorData.message}`,
          type: 'error'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: 'An unexpected error occurred.',
        type: 'error'
      });
    }
  };

  const handleEdit = (examId) => {
    navigate(`/edit-exam/${examId}`);  // This will navigate to the editor page
  };

  const handlePreview = (examId) => {
    navigate(`/preview-exam/${examId}`); // Navigate to the preview page

  };

  const handleDelete = (examId) => {

  };

  const [selectedUsers, setSelectedUsers] = useState([]);

  // Add this function to handle assignment
  const handleAssign = () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }

    // Get existing assignments or initialize empty object
    const assignments = JSON.parse(localStorage.getItem('examAssignments') || '{}');
    
    // Add new assignment
    assignments[selectedExam.exam_id] = {
      students: selectedStudents,
      assignedDate: new Date().toISOString()
    };

    // Save back to localStorage
    localStorage.setItem('examAssignments', JSON.stringify(assignments));
    
    // Clear selections and close modal
    setSelectedStudents([]);
    setSelectedExam(null);
    alert('Exam assigned successfully!');
  };

  // Add a function to handle question field changes
  const handleQuestionChange = (questionIndex, field, value) => {
    setFormData(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [field]: value
      };
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  // Add state for showing answers
  const [showAnswers, setShowAnswers] = useState(null);

  return (
    <div className={styles.main}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={styles.contentArea}>
        <div className={styles.headerWrapper}>
          <Header />
        </div>
        <div className={styles.pageContent}>
                  <div className={styles.breadcrumbContainer}>
                  <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage> Create an exam</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          </div>
          <Create />
          {alert.show && (
            <div className={`${styles.alert} ${styles[alert.type]}`}>
              {alert.message}
            </div>
          )}
          <div className={styles.container}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Title:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={styles.textInput}
                  placeholder="Enter exam title"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Duration:</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className={styles.textInput}
                  placeholder="Enter duration"
                />
              </div>

              <button className={styles.submitButton} type="submit">Create Exam</button>
            </form>
          </div>
          <div className={styles.twrapper}>
            <table className={styles.examlist}>
              <thead>
                <tr className={styles.header}>
                  <th></th>
                  <th>Exam ID</th>
                  <th>Title</th>
                  <th>Created</th>
                  <th>Duration</th>
                  <th>Answers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentExams.length > 0 ? (
                  currentExams.map((exam) => (
                    <tr key={exam.exam_id} className={styles.examRow}>
                      <td>
                        <input type="checkbox" className={styles.uicheckbox} />
                      </td>
                      <td>{exam.exam_id}</td>
                      <td>{exam.title}</td>
                      <td>{exam.created_at}</td>
                      <td>{exam.duration}</td>
                      <td className={styles.answersColumn}>
                        <button 
                          className={styles.viewAnswersBtn}
                          onClick={() => setShowAnswers(exam.exam_id)}
                        >
                          View Answers
                        </button>
                        {showAnswers === exam.exam_id && (
                          <div className={styles.answersPopup}>
                            <div className={styles.answersContent}>
                              <h3>Correct Answers</h3>
                              <div className={styles.answersList}>
                                {exam.questions?.map((question, index) => (
                                  <div key={index} className={styles.answerItem}>
                                    {index + 1}. {question.correct_answer}
                                  </div>
                                ))}
                              </div>
                              <button 
                                className={styles.closeAnswersBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowAnswers(null);
                                }}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className={styles.actionButtons}>
                        <button 
                          className={`${styles.actionBtn} ${styles.editBtn}`}
                          onClick={() => handleEdit(exam.exam_id)}
                        >
                          Edit
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.previewBtn}`}
                          onClick={() => handlePreview(exam.exam_id)}
                        >
                          Preview
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.assignBtn}`}
                          onClick={() => handleExamClick(exam)}
                        >
                          Assign
                        </button>
                        <div>
                          <AlertDialog>
                            <AlertDialogTrigger className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                              Delete
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your exam
                                  and remove its data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className={styles.deleteBtn}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>
                      No exams found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className={styles.pagination}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`${styles.pageButton} ${
                    currentPage === index + 1 ? styles.activePage : ''
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add the modal */}
      {selectedExam && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Assign Exam: {selectedExam.title}</h2>
            <div className={styles.studentList}>
              {students.map((student) => (
                <div key={student.id} className={styles.studentItem}>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents([...selectedStudents, student.id]);
                      } else {
                        setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                      }
                    }}
                  />
                  <span>{student.username} - {student.email}</span>
                </div>
              ))}
              <button onClick={handleAssign}>Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePage;