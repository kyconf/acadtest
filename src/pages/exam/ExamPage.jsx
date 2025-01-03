import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ExamPage.module.css';
import { API_URL } from '../../config/config';

function ExamPage() {
  const { examId } = useParams(); // Extract the examId from the URL
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [preview, setPreview] = useState(null); // Initialize preview state
  const [selectedOptions, setSelectedOptions] = useState({}); // Object to store selections for each question

  const fetchPreview = async () => {
    try {
      console.log(`Fetching data from: ${API_URL}/preview-exams/${examId}`); // Log the URL
      const response = await fetch(`${API_URL}/preview-exams/${examId}`);
      if (response.ok) {
        const data = await response.json();
        setPreview(data); // Set the fetched data to preview state
      } else {
        console.error('Failed to fetch:', response.statusText); // Log any errors
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  // Use useEffect to fetch exams on component mount
  useEffect(() => {
    fetchPreview();
  }, [examId]);

  // Check if preview data is available
  if (!preview || preview.length === 0) {
    return <p>Loading...</p>; // Show loading state while fetching
  }


  const handleNext = () => {
    if (currentQuestion < preview.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      console.log("Success");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      
    }
  };

  const currentQ = preview[currentQuestion];

  const handleOptionSelect = (option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [currentQuestion]: option // Store selection for current question
    }));
  };

  return (
    <div className={styles.examContainer}>
      {/* Header */}
      <div className={styles.examHeader}>
        <div className={styles.sectionInfo}>
          <h2>Section {currentQ[`section_id`]}, Module {currentQ[`module_id`]}: {currentQ[`module_name`]}</h2>
          <button className={styles.hideButton}>Hide</button>
        </div>
        <div className={styles.examTools}>
          <div className={styles.timer}>28:45</div>
          <button className={styles.toolButton}>
            <span>✎</span>
            Annotate
          </button>
          <button className={styles.toolButton}>
            <span>🖩</span>
            Calculator
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.examContent}>
        <div className={styles.questionText}>
          <p>{currentQ[`question_passage`]}</p>
        </div>
        
        <div className={styles.questionArea}>
          <div className={styles.questionHeader}>
            <div className={styles.questionNumber}>{currentQ[`question_number`]}</div>
            <button 
              className={`${styles.reviewButton} ${isMarkedForReview ? styles.marked : ''}`}
              onClick={() => setIsMarkedForReview(!isMarkedForReview)}
            >
              Mark for Review
            </button>
          </div>
          
          <p className={styles.questionPrompt}>{currentQ[`question_prompt`]}</p>

          <div className={styles.options}>
            {["A","B","C","D"].map((option) => (
              <button 
                key={option}
                className={`${styles.optionButton} ${selectedOptions[currentQuestion] === option ? styles.selected : ''}`}
                onClick={() => handleOptionSelect(option)}
              >
                <span className={styles.optionLetter}>{option}</span>
                {currentQ[`question_choice_${option}`]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.examFooter}>
        <div className={styles.userInfo}>Yiyeon Su</div>
        <div className={styles.questionNav}>
          <button 
            className={styles.navButton} 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          Question {currentQ[`question_number`]} of 3
          <button 
            className={styles.navButton} 
            onClick={handleNext}
            disabled={currentQuestion === preview.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExamPage; 