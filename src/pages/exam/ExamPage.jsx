import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ExamPage.module.css';
import { API_URL } from '../../config/config';
import Timer from './Timer'
import abc from '../../assets/abc.png';

function ExamPage() {
  const { examId } = useParams(); // Extract the examId from the URL
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [preview, setPreview] = useState(null); // Initialize preview state
  const [selectedOptions, setSelectedOptions] = useState({}); // Object to store selections for each question
  const [timerValue, setTimerValue] = useState(3600); // 1 hour in seconds
  const [showTimer, setShowTimer] = useState(true);
  const [annotations, setAnnotations] = useState({
    active: false,
    highlights: {},
    pendingSelection: null
  });
  const [crossedOut, setCrossedOut] = useState({}); // Add this state
  const [highlights, setHighlights] = useState({}); // Add state for highlighted text
  const [crossedAnswers, setCrossedAnswers] = useState({});

  const [showCalculator, setShowCalculator] = useState(false); // State to toggle the calculator
  const calculatorRef = useRef(null); // Ref for the calculator container
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null);

  const [selectedText, setSelectedText] = useState(null);

  // Add state for calculator position
  const [calculatorPos, setCalculatorPos] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Add this state to track marked questions
  const [markedForReview, setMarkedForReview] = useState({});

  // Add state for review modal
  const [showReview, setShowReview] = useState(false);

  // Add submit button and review state
  const [showSubmitReview, setShowSubmitReview] = useState(false);

  // Add state for submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const exam = exams.find(exam => exam.exam_id.toString() === selectedId);
    setSelectedExam(exam);
  };

  const toggleCalculator = () => {
    if (!window.Desmos) {
      console.error("Desmos library is not loaded.");
      return;
    }

    setShowCalculator((prev) => !prev); // Toggle the visibility of the calculator
  };

  const toggleTimer = () => {
    setShowTimer(!showTimer);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text) {
      // Check if we selected a highlighted text
      const parent = selection.anchorNode.parentElement;
      if (parent.classList.contains(styles.highlighted)) {
        // Store the highlighted element to remove it
        setSelectedRange({ type: 'remove', element: parent });
      } else {
        // Store new text to highlight
        setSelectedRange({ type: 'add', range: selection.getRangeAt(0).cloneRange() });
      }
    }
  };

  const handleAnnotation = () => {
    if (!selectedRange) return;

    if (selectedRange.type === 'remove') {
      // Remove highlight
      selectedRange.element.outerHTML = selectedRange.element.textContent;
    } else {
      // Add highlight
      const span = document.createElement('span');
      span.className = styles.highlighted;
      selectedRange.range.surroundContents(span);
    }

    // Clear selection
    window.getSelection().removeAllRanges();
    setSelectedRange(null);
  };

  const handleCrossOut = (questionId, option) => {
    const key = `${questionId}-${option}`;
    setCrossedOut(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleHighlight = (e) => {
    e.preventDefault();
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      setHighlights(prev => ({
        ...prev,
        [currentQ.id]: [...(prev[currentQ.id] || []), selectedText]
      }));
    }
  };

  const handleCrossAnswer = () => {
    const selectedOption = selectedOptions[currentQ.id];
    if (!selectedOption) return;

    setCrossedAnswers(prev => {
      const key = `${currentQ.id}-${selectedOption}`;
      return {
        ...prev,
        [key]: !prev[key]
      };
    });
  };

  // Add these handlers for dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = calculatorRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    setCalculatorPos({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    let calculator;
    if (showCalculator && window.Desmos) {
      calculator = window.Desmos.GraphingCalculator(calculatorRef.current, {
        expressions: true,
        settingsMenu: true,
      });

    }

    return () => {
      if (calculator) {
        calculator.destroy();
      }
    };
  }, [showCalculator]); // Run this effect when `showCalculator` changes

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
      [`question_${currentQ.question_number}`]: option // Use question number as key
    }));
  };

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    try {
      const response = await fetch(`${API_URL}/preview-exams/${examId}`, { //port 3000 /a-register
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message); // Show success message
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`); // Show error message
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred.');
    }
  };

  // Add this handler
  const handleMarkForReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQ.question_number]: !prev[currentQ.question_number]
    }));
  };

  // Update the FlagIcon component to be a proper flag
  const FlagIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" 
        fill={markedForReview[currentQ.question_number] ? "#ffd700" : "#666"}/>
    </svg>
  );

  // Update the handleSubmitExam function
  const handleSubmitExam = async () => {
    try {
      // Get the exam data to check correct answers
      const examData = preview;
      
      // Calculate score
      let correctAnswers = 0;
      const gradedAnswers = Object.entries(selectedOptions).map(([questionNumber, answer]) => {
        const question = examData.find(q => 
          `question_${q.question_number}` === questionNumber
        );
        const isCorrect = question.correct_answer === answer;
        if (isCorrect) correctAnswers++;
        
        return {
          questionNumber: questionNumber.replace('question_', ''),
          selectedAnswer: answer,
          isCorrect
        };
      });

      const score = Math.round((correctAnswers / examData.length) * 100);

      const examSubmission = {
        examId: examId,
        studentId: 1, // This should come from authentication later
        studentName: "Jane Doe", // This should come from authentication later
        answers: gradedAnswers,
        score: score,
        correctAnswers,
        totalQuestions: examData.length,
        submittedAt: new Date().toISOString()
      };

      // Store in localStorage for now
      const submissions = JSON.parse(localStorage.getItem('examSubmissions') || '[]');
      submissions.push(examSubmission);
      localStorage.setItem('examSubmissions', JSON.stringify(submissions));

      // Show score to student
      alert(`Exam submitted! Your score: ${score}%`);
      
      // Navigate back to student dashboard
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to submit exam');
    }
  };

  // Update the QuestionReview component
  const QuestionReview = () => (
    <div className={styles.reviewModal}>
      <div className={styles.reviewContent}>
        <h2>Review Your Answers</h2>
        <div className={styles.questionGrid}>
          {preview.map((q, index) => (
            <button
              key={q.question_number}
              className={`${styles.questionButton} 
                ${selectedOptions[`question_${q.question_number}`] ? styles.answered : ''} 
                ${markedForReview[q.question_number] ? styles.marked : ''}`}
              onClick={() => {
                setCurrentQuestion(index);
                setShowReview(false);
              }}
            >
              {q.question_number}
              {markedForReview[q.question_number] && <FlagIcon />}
            </button>
          ))}
        </div>
        <div className={styles.reviewLegend}>
          <div><span className={styles.answered}>●</span> Answered</div>
          <div><FlagIcon /> Marked for Review</div>
          <div><span className={styles.unanswered}>●</span> Unanswered</div>
        </div>
        <div className={styles.reviewButtons}>
          {showSubmitReview ? (
            <>
              <button 
                className={styles.submitButton} 
                onClick={handleSubmitExam}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </button>
              <button 
                className={styles.returnButton} 
                onClick={() => {
                  setShowReview(false);
                  setShowSubmitReview(false);
                }}
              >
                Return to Exam
              </button>
            </>
          ) : (
            <button className={styles.closeButton} onClick={() => setShowReview(false)}>
              Close Review
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.examContainer}>
      {/* Header */}
      <div className={styles.examHeader}>
        <div className={styles.sectionInfo}>
          <h2>Section {currentQ.section_id}, Module {currentQ.module_id}: {currentQ.module_name}</h2>
        </div>
        <div className={styles.examTools}>
          <div className={styles.timer}>
            <Timer 
              initialValue={timerValue} 
              onTick={setTimerValue} 
              visible={showTimer} 
            />
            <button onClick={toggleTimer} className={styles.hideButton}>
              {showTimer ? 'Hide' : 'Show'} Timer
            </button>
          </div>
          
          <button 
            className={styles.toolButton}
            onClick={handleAnnotation}
          >
            <span>✎</span>
            Annotate
          </button>
          <button onClick={toggleCalculator} className={styles.toolButton}>
          🖩 Calculator
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.examContent}>
        {showCalculator && (
          <div 
            ref={calculatorRef}
            style={{
              width: "500px",
              height: "500px",
              border: "1px solid #ccc",
              position: "fixed",
              top: calculatorPos.y + "px",
              left: calculatorPos.x + "px",
              zIndex: 1000,
              backgroundColor: "white",
              cursor: isDragging ? 'grabbing' : 'grab',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              style={{ 
                padding: '10px',
                borderBottom: '1px solid #ccc',
                cursor: 'grab',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f5f5f5'
              }}
            >
              <span>Calculator - Drag to move</span>
              <button 
                onClick={toggleCalculator}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '0 5px'
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}
        <div 
          className={styles.questionText}
          onContextMenu={handleContextMenu}
        >
          <div 
            dangerouslySetInnerHTML={{ __html: currentQ.question_passage }}
          />
        </div>
        <div className={styles.divider}></div>

        <div className={styles.questionArea}>
          <div className={styles.questionHeader}>
            <div className={styles.questionNumber}>{currentQ.question_number}</div>
            <button 
              className={`${styles.reviewButton} ${markedForReview[currentQ.question_number] ? styles.marked : ''}`}
              onClick={handleMarkForReview}
            >
              <FlagIcon />
              Mark for Review
            </button>
            
            <div className={styles.abcWrapper} onClick={handleCrossAnswer}>
              <img className={styles.abc} src={abc} alt="ABC" />
            </div>
          </div>
          
          <p className={styles.questionPrompt} dangerouslySetInnerHTML={{ __html: currentQ.question_prompt }}></p>

          <div className={styles.options}>
            {["A","B","C","D"].map((option) => (
              <button 
                key={option}
                className={`${styles.optionButton} 
                  ${selectedOptions[`question_${currentQ.question_number}`] === option ? styles.selected : ''} 
                  ${crossedAnswers[`${currentQ.id}-${option}`] ? styles.crossedOut : ''}`}
                onClick={() => handleOptionSelect(option)}
              >
                <span className={styles.optionLetter}>{option}</span>
                <div className={styles.choice} 
                  dangerouslySetInnerHTML={{ __html: currentQ[`question_choice_${option}`] }}
                />
              </button>
            ))}
          </div>
        </div>

        {annotations.active && (
          <div className={styles.annotationArea}>
            <textarea 
              placeholder="Add your notes here..."
              className={styles.annotationInput}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.examFooter}>
        <div className={styles.userInfo}>Yiyeon Su</div>
        <div className={styles.questionNav}>
          <div className={styles.questionPagination}>
            <select 
              onChange={handleSelectChange}
              className={styles.selectPagination}
            > 
              {preview.map((exam, index) => (
                <option key={exam.exam_id || index} value={exam.exam_id}>
                  Question {exam.question_number} of 3
                </option>
              ))}
            </select>
          </div>
          <button 
            className={styles.navButton}
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          Question {currentQ.question_number} of 3
          {currentQuestion === preview.length - 1 ? (
            <button 
              className={styles.submitButton}
              onClick={handleSubmitExam}
            >
              Submit Exam
            </button>
          ) : (
            <button 
              className={styles.navButton}
              onClick={handleNext}
              disabled={currentQuestion === preview.length - 1}
            >
              Next
            </button>
          )}
        </div>
        {showReview && <QuestionReview />}
      </div>
    </div>
  );
}

export default ExamPage; 