import React, { useState, useEffect } from 'react';
import styles from './ImportAI.module.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Import from '../../components/Import';

function ImportAI() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/exams');
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };
    fetchExams();
  }, []);

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const exam = exams.find(exam => exam.exam_id.toString() === selectedId);
    setSelectedExam(exam);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Your submit logic here
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
          <Import />
          
          <div className={styles.formSection}>
            <h2>Import exam</h2>
            
            <div className={styles.formGroup}>
              <label>Select a file:</label>
              <input 
                type="file" 
                id="myfile" 
                name="myfile" 
                className={styles.fileInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Choose a test:</label>
              <select 
                onChange={handleSelectChange}
                className={styles.selectInput}
              > 
                <option value="" disabled selected>Select an exam</option>
                {exams.map((exam) => (
                  <option key={exam.exam_id} value={exam.exam_id}>
                    {exam.title}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Enter Text:</label>
              <textarea
                className={styles.textarea}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
                rows={4}
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportAI;
