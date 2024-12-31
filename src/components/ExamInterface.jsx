import { useState } from 'react';
import styles from './ExamInterface.module.css';

function ExamInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);

  // Hardcoded exam data
  const examData = {
    title: "Section 1, Module 1: Reading and Writing",
    timeLeft: "28:45",
    questions: [
      {
        id: 1,
        passage: "The---- of Maria Irene Fornes' play Mud—a realistic room perched on a dirt pile—challenges conventional interpretations of stage scenery.",
        prompt: "Which choice completes the text with the most logical and precise word or phrase?",
        options: [
          { id: 'A', text: 'appeal' },
          { id: 'B', text: 'plot' },
          { id: 'C', text: 'mood' },
          { id: 'D', text: 'setting' }
        ]
      },
      {
        id: 2,
        passage: "The author's description of the sunset ---- the peaceful mood of the scene.",
        prompt: "Which word best completes the sentence?",
        options: [
          { id: 'A', text: 'enhances' },
          { id: 'B', text: 'disrupts' },
          { id: 'C', text: 'maintains' },
          { id: 'D', text: 'concludes' }
        ]
      }
    ]
  };

  const handleNext = () => {
    if (currentQuestion < examData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = examData.questions[currentQuestion];

  return (
    <div className={styles.examContainer}>
      {/* Header */}
      <div className={styles.examHeader}>
        <div className={styles.sectionInfo}>
          <h2>{examData.title}</h2>
          <button className={styles.hideButton}>Hide</button>
        </div>
        <div className={styles.examTools}>
          <div className={styles.timer}>{examData.timeLeft}</div>
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
          <p>{currentQ.passage}</p>
        </div>
        
        <div className={styles.questionArea}>
          <div className={styles.questionHeader}>
            <div className={styles.questionNumber}>{currentQ.id}</div>
            <button 
              className={`${styles.reviewButton} ${isMarkedForReview ? styles.marked : ''}`}
              onClick={() => setIsMarkedForReview(!isMarkedForReview)}
            >
              Mark for Review
            </button>
          </div>
          
          <p className={styles.questionPrompt}>{currentQ.prompt}</p>

          <div className={styles.options}>
            {currentQ.options.map((option) => (
              <button key={option.id} className={styles.optionButton}>
                <span className={styles.optionLetter}>{option.id}</span>
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.examFooter}>
        <div className={styles.userInfo}>Asd Su</div>
        <div className={styles.questionNav}>
          <button 
            className={styles.navButton} 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          Question {currentQ.id} of {examData.questions.length}
          <button 
            className={styles.navButton} 
            onClick={handleNext}
            disabled={currentQuestion === examData.questions.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExamInterface; 