import React, { useState, useEffect } from 'react';
import styles from './SubmissionsPage.module.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { API_URL } from '../../config/config';

function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [examPreview, setExamPreview] = useState(null);
  const [examData, setExamData] = useState(null);

  useEffect(() => {
    // Get submissions from localStorage
    const storedSubmissions = JSON.parse(localStorage.getItem('examSubmissions') || '[]');
    setSubmissions(storedSubmissions);
  }, []);

  const fetchExamPreview = async (examId) => {
    try {
      const response = await fetch(`${API_URL}/preview-exams/${examId}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
    }
  };

  const reviewSubmission = async (submission) => {
    const examData = await fetchExamPreview(submission.examId);
    
    // Calculate score
    const score = submission.answers.reduce((total, answer) => {
      const question = examData.find(q => q.question_number.toString() === answer.questionNumber);
      if (question && question.correct_answer === answer.selectedAnswer) {
        return total + 1;
      }
      return total;
    }, 0);

    const scorePercentage = Math.round((score / submission.answers.length) * 100);

    setExamPreview(examData);
    setSelectedSubmission({
      ...submission,
      score,
      scorePercentage
    });
  };

  const handleDelete = (submissionIndex) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      const updatedSubmissions = submissions.filter((_, index) => index !== submissionIndex);
      localStorage.setItem('examSubmissions', JSON.stringify(updatedSubmissions));
      setSubmissions(updatedSubmissions);
    }
  };

  const handleCloseModal = () => {
    setSelectedSubmission(null);
    setExamPreview(null);
  };

  return (
    <div className={styles.main}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={styles.contentArea}>
        <Header />
        <div className={styles.contentWrapper}>
          <div className={styles.breadcrumbContainer}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Student Submissions</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className={styles.pageContent}>
            <div className={styles.submissionsList}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Exam ID</th>
                    <th>Score</th>
                    <th>Questions Answered</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission, index) => (
                    <tr key={index} className={styles.submissionRow}>
                      <td>{submission.studentName}</td>
                      <td>{submission.examId}</td>
                      <td>{submission.score}%</td>
                      <td>{submission.correctAnswers}/{submission.totalQuestions}</td>
                      <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                      <td className={styles.actionButtons}>
                        <button 
                          className={styles.reviewButton}
                          onClick={() => reviewSubmission(submission)}
                        >
                          Review
                        </button>
                        <button 
                          className={styles.deleteButton}
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr>
                      <td colSpan="5" className={styles.noSubmissions}>
                        No submissions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedSubmission && examPreview && (
        <div 
          className={styles.modal}
          onClick={handleCloseModal}
        >
          <div 
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderTop}>
                <h2>Student Submission Review</h2>
                <div className={styles.score}>
                  Score: {selectedSubmission.score}/{examPreview.length} ({selectedSubmission.scorePercentage}%)
                </div>
                <button 
                  className={styles.closeModalButton}
                  onClick={handleCloseModal}
                >
                  ×
                </button>
              </div>
              <div className={styles.submissionInfo}>
                <p><strong>Student:</strong> {selectedSubmission.studentName}</p>
                <p><strong>Submitted:</strong> {new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
              </div>
            </div>

            <div className={styles.examPreview}>
              {examPreview.map((question, index) => (
                <div key={index} className={styles.questionReview}>
                  <div className={styles.questionPassage}>
                    <div dangerouslySetInnerHTML={{ __html: question.question_passage }} />
                  </div>
                  
                  <div className={styles.questionContent}>
                    <div className={styles.questionHeader}>
                      <span className={styles.questionNumber}>Question {question.question_number}</span>
                    </div>
                    
                    <div className={styles.questionPrompt} 
                      dangerouslySetInnerHTML={{ __html: question.question_prompt }} 
                    />

                    <div className={styles.options}>
                      {["A", "B", "C", "D"].map((option) => {
                        const answer = selectedSubmission.answers.find(
                          answer => answer.questionNumber === question.question_number.toString()
                        );
                        const isSelected = answer?.selectedAnswer === option;
                        const isCorrect = answer?.isCorrect;

                        return (
                          <div 
                            key={option}
                            className={`${styles.optionReview} 
                              ${isSelected ? styles.selectedAnswer : ''} 
                              ${isSelected && isCorrect ? styles.correctAnswer : ''}
                              ${isSelected && !isCorrect ? styles.incorrectAnswer : ''}`}
                          >
                            <span className={styles.optionLetter}>{option}</span>
                            <div 
                              className={styles.optionText}
                              dangerouslySetInnerHTML={{ __html: question[`question_choice_${option}`] }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={styles.closeButton}
                onClick={handleCloseModal}
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmissionsPage; 