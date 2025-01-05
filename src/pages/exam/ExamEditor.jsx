import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ExamEditor.module.css';
import { API_URL } from '../../config/config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
import katex from 'katex';
import ImageResize from 'quill-image-resize-module-react';
import Quill from 'quill';
Quill.register('modules/imageResize', ImageResize);


function ExamEditor() {
  const { examId } = useParams(); // Extract the examId from the URL
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [preview, setPreview] = useState(null); // Initialize preview state
  const [selectedOptions, setSelectedOptions] = useState({}); // Object to store selections for each question

  const [editingModuleIndex, setEditingModuleIndex] = useState({});

  const modules = {
    toolbar: [
  
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image', 'formula'],
      ['clean']
    ],
    formula: true,
    imageResize: {
      displaySize: true,
      modules: ['Resize', 'DisplaySize', 'Toolbar']
    }
  };

  const formats = [

    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'script',
    'indent',
    'link', 'image', 'formula'
  ];


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

  

  return (
    <div className={styles.examContainer}>
      {/* Header */}
      <div className={styles.examHeader}>
        <div className={styles.sectionInfo}>
          <h2>Section {currentQ[`section_id`]}, Module {currentQ[`module_id`]}:               <select
                className={styles.selectInput}
                id="module"
                name="module"
                value={currentQ[`module_name`]}
                
                required
              >
                <option value="" disabled>Select a Module</option> {/* Placeholder option */}
                <option value="Reading and Writing">Reading & Writing</option>
                <option value="Math">Math</option>
              </select></h2>
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


          <ReactQuill
              theme="snow"
              value={currentQ[`question_passage`]}

              modules={modules}
              formats={formats}
              className={styles.editor}
            />
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
          <div>

          <ReactQuill
              theme="snow"
              value={currentQ[`question_prompt`]}

              modules={modules}
              formats={formats}
              className={styles.editor}
            />
          </div>


          <div className={styles.options}>
            {["A","B","C","D"].map((option) => (
              <button 
                key={option}
                className={`${styles.optionButton} ${selectedOptions[currentQuestion] === option ? styles.selected : ''}`}
                onClick={() => handleOptionSelect(option)}
              >
                <span className={styles.optionLetter}>{option}</span>
                
                <ReactQuill
              theme="snow"
              value={currentQ[`question_choice_${option}`]}

              modules={modules}
              formats={formats}
              className={styles.editor}
            />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.examFooter}>
        <div className={styles.userInfo}>Exam Editor Mode</div>
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

export default ExamEditor; 