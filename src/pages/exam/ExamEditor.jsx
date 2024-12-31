import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ExamEditor.module.css';
import Sidebar from '../../components/Sidebar';

function ExamEditor() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState({
    title: '',
    module: '',
    duration: '',
    sections: []
  });

  const [formData, setFormData] = useState({
    title: '',
    module: '',
    duration:0
  });

    
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [editingModuleIndex, setEditingModuleIndex] = useState({});

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await fetch(`http://localhost:3000/exams/${examId}`);
        const data = await response.json();
        setExamData(data);
      } catch (error) {
        console.error('Error fetching exam:', error);
      }
    };

    fetchExam();
  }, [examId]);

  const handleAddSection = () => {
    const newSection = { title: `Section ${examData.sections.length + 1}`, modules: [] };
    setExamData({ ...examData, sections: [...examData.sections, newSection] });
  };

  const handleAddModule = (sectionIndex) => {
    const newModule = { title: `Module ${examData.sections[sectionIndex].modules.length + 1}`, questions: [] };
    const updatedSections = [...examData.sections];
    updatedSections[sectionIndex].modules.push(newModule);
    setExamData({ ...examData, sections: updatedSections });
    
    setEditingModuleIndex({ [`${sectionIndex}-${updatedSections[sectionIndex].modules.length - 1}`]: true });
  };

  const handleAddQuestion = (sectionIndex, moduleIndex) => {
    const newQuestion = { text: '', answer: '' };
    const updatedSections = [...examData.sections];
    updatedSections[sectionIndex].modules[moduleIndex].questions.push(newQuestion);
    setExamData({ ...examData, sections: updatedSections });
  };

  const handleQuestionChange = (sectionIndex, moduleIndex, questionIndex, field, value) => {
    const updatedSections = [...examData.sections];
    updatedSections[sectionIndex].modules[moduleIndex].questions[questionIndex] = {
      ...updatedSections[sectionIndex].modules[moduleIndex].questions[questionIndex],
      [field]: value
    };
    setExamData({ ...examData, sections: updatedSections });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/exams/${examId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData),
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

  return (
    <div className={styles.main}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={styles.contentArea}>
        <div className={styles.header}>
          <h1>Edit Exam {examId}</h1>
          <button onClick={() => navigate('/create-exam')}>Back to List</button>
        </div>
        
        <div className={styles.editorContainer}>
          <div className={styles.examDetails}>
            <h2>Exam Details</h2>
            <input 
              type="text"
              value={examData.title}
              onChange={(e) => setExamData({...examData, title: e.target.value})}
              placeholder="Exam Title"
              required
            />
            <input 
              type="text"
              value={examData.module}
              onChange={(e) => setExamData({...examData, module: e.target.value})}
              placeholder="Module"
              required
            />
            <input 
              type="number"
              value={examData.duration}
              onChange={(e) => setExamData({...examData, duration: e.target.value})}
              placeholder="Duration (minutes)"
              required
            />
          </div>

          <div className={styles.sectionList}>
            <h2>Sections</h2>
            {examData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className={styles.sectionItem}>
                <h3>{section.title}</h3>
                <button className={styles.addModuleButton} onClick={() => handleAddModule(sectionIndex)}>
                  Add Module
                </button>
                {section.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className={styles.moduleItem}>
                    <h4>{module.title}</h4>            <div>
              <label htmlFor="module">Module</label>
              <select
                id="module"
                name="module"
                value={formData.module}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select a Module</option> {/* Placeholder option */}
                <option value="Reading and Writing">Reading & Writing</option>
                <option value="Math">Math</option>
              </select>
            </div>
                    {editingModuleIndex[`${sectionIndex}-${moduleIndex}`] && (
                      <>
                        {module.questions.map((question, questionIndex) => (
                          <div key={questionIndex} className={styles.questionItem}>
                            <span>Question {questionIndex + 1}:</span>
                            <textarea
                              value={question.text}
                              onChange={(e) => handleQuestionChange(sectionIndex, moduleIndex, questionIndex, 'text', e.target.value)}
                              placeholder="Question text"
                              required
                            />
                            <input
                              type="text"
                              value={question.answer}
                              onChange={(e) => handleQuestionChange(sectionIndex, moduleIndex, questionIndex, 'answer', e.target.value)}
                              placeholder="Correct answer"
                              required
                            />
                            <button>Save Changes</button>
                            <button className={styles.deleteQuestionButton} onClick={() => handleDeleteQuestion(sectionIndex, moduleIndex, questionIndex)}>Delete</button>
                          </div>
                  
                        ))}
                        <button className={styles.addQuestionButton} onClick={() => handleAddQuestion(sectionIndex, moduleIndex)}>
                          Add Question
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
            <button className={styles.addSectionButton} onClick={handleAddSection}>
              Add Section
            </button>
          </div>

          <div className={styles.actions}>
            <button className={styles.saveButton} onClick={handleSave}>Save Changes</button>
            <button 
              className={styles.cancelButton}
              onClick={() => navigate('/create-exam')}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamEditor; 