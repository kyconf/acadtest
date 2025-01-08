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
  const { examId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [editingModuleIndex, setEditingModuleIndex] = useState({});

  const [examData, setExamData] = useState({ //you send the examdata here
    section: '',
    module: 0,
    number: 0,
    prompt: '',
    passage: '',
    choice_A: '',
    choice_B: '',
    choice_C: '',
    choice_D: '',
    correct_answer: ''
  });

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
      console.log(`Fetching data from: ${API_URL}/preview-exams/${examId}`);
      const response = await fetch(`${API_URL}/preview-exams/${examId}`);
      if (response.ok) {
        const data = await response.json();
        setPreview(data);
      } else {
        console.error('Failed to fetch:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  useEffect(() => {
    fetchPreview();
  }, [examId]);

  if (!preview || preview.length === 0) {
    return <p>Loading...</p>;
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

  const handleChange = (field, value) => {
    setExamData((prev) => ({
      ...prev,
      [field]: value,
    }));
  
    // Update the current question in preview
    setPreview((prev) =>
      prev.map((question, index) =>
        index === currentQuestion
          ? { ...question, [field]: value }
          : question
      )
    );
  };


  const handleOptionSelect = (option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [currentQuestion]: option // Store selection for current question
    }));

    handleChange('correct_answer', option);
  };

  const handleSave = async () => {
    const currentData = {
      section: preview[currentQuestion]?.section_id || examData.section,
      module: preview[currentQuestion]?.module_id || examData.module,
      number: preview[currentQuestion]?.question_number || examData.number,
      prompt: preview[currentQuestion]?.question_prompt || examData.prompt,
      passage: preview[currentQuestion]?.question_passage || examData.passage,
      choice_A: preview[currentQuestion]?.question_choice_A || examData.choice_A,
      choice_B: preview[currentQuestion]?.question_choice_B || examData.choice_B,
      choice_C: preview[currentQuestion]?.question_choice_C || examData.choice_C,
      choice_D: preview[currentQuestion]?.question_choice_D || examData.choice_D,
      correct_answer: preview[currentQuestion]?.correct_answer || examData.correct_answer,
    };

    try {
      const response = await fetch(`${API_URL}/preview-exams/${examId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentData),
      });

      if (response.ok) {
        alert('Changes saved successfully!');
      } else {
        alert('Failed to save changes.');
      }
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  

  const currentQ = preview[currentQuestion];

  return (
    
    <div className={styles.examContainer}>
      
      <div className={styles.examHeader}>
        <div className={styles.sectionInfo}>
          <h2>Section {currentQ[`section_id`]}, Module {currentQ[`module_id`]}: 
            <select
              className={styles.selectInput}
              id="module"
              name="module"
              value={currentQ[`module_name`]}
              required
            >
              <option value="" disabled>Select a Module</option>
              <option value="Reading and Writing">Reading & Writing</option>
              <option value="Math">Math</option>
            </select>
          </h2>
          <button className={styles.hideButton}>Hide</button>
        </div>
        <div className={styles.examTools}>
          <div className={styles.timer}></div>
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
      
      <div className={styles.examContent}>
        <div className={styles.questionText}>
          <ReactQuill
            theme="snow"
            value={currentQ[`question_passage`]}
            modules={modules}
            formats={formats}
            className={styles.editor}
            onChange={(value) => handleChange('question_passage', value)}
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
              onChange={(value) => handleChange('question_prompt', value)}
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
                  onChange={(value) => handleChange(`question_choice_${option}`, value)}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      

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
          <button onClick={handleSave}>Save Changes</button>
      
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