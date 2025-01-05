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

  useEffect(() => {
    async function fetchExams() {
      try {
        const response = await fetch(`${API_URL}/exams`); // Fetch data from the backend 3000 login
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`); // Handle HTTP errors
        }
        const data = await response.json(); // Parse the JSON response
        setExams(data); // Update state with the fetched data
      } catch (err) {
        setError(err.message); // Update error state if there's an issue
      }
    }

    fetchExams();
  }, []); // Empty dependency array to fetch data on component mount

  if (error) {
    return <p>Error fetching users: {error}</p>; // Display error if it occurs
  }




  // State for form data
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      duration:0
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
                <label>Module:</label>
                <select
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={styles.selectInput}
                >
                  <option value="" disabled>Select a Module</option>
                  <option value="Reading and Writing">Reading & Writing</option>
                  <option value="Math">Math</option>
                </select>
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

                <label>Section:</label>
                <select
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={styles.selectInput}
                >
                  <option value="" disabled>Select a Module</option>
                  <option value="Reading and Writing">Reading & Writing</option>
                  <option value="Math">Math</option>
                </select>
              

              <button type="submit">Create Exam</button>
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
                      <td className={styles.actionButtons}>
                        <button 
                          className={`${styles.actionBtn} ${styles.editBtn}`}
                          onClick={() => handleEdit(exam.exam_id)}
                        >
                          Edit
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.assignBtn}`}
                          onClick={() => handleAssign(exam.exam_id)}
                        >
                          Assign
                        </button>

                      <div className={styles.deleteBtn}>
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
                              <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                        <button 
                          className={`${styles.actionBtn} ${styles.editBtn}`}
                          onClick={() => handlePreview(exam.exam_id)}
                        >
                          Preview
                        </button>
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
    </div>
  );
}

export default CreatePage;