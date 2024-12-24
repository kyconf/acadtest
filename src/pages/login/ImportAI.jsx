import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import styles from './ImportAI.module.css';



function ImportAI() {
  const navigate = useNavigate();
  
  const navButton = () => {
      navigate('/teacher'); // Replace '/start-learning' with your desired route
  };

    // State to manage the rows in the table
    const [rows, setRows] = useState([]);

    // Function to handle adding a new row
    const addRow = () => {
      const newRow = {
        name: 'New Student',
        id: rows.length + 1,
        email: `student${rows.length + 1}@example.com`,
        password: 'password123',
      };
      
      setRows([...rows, newRow]);
    };


  // Simplified deleteRow using a curried function
  const deleteRow = (index) => {
    const updatedRows = rows.filter((row, i) => i !== index);
    setRows(updatedRows);
  };
  

  const [inputText, setInputText] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent page reload
      console.log('Submitting prompt:', inputText); // Log the inputText being sent

      if (!inputText.trim()) {
        alert('Please enter a valid prompt before submitting.');
        return;
      }
      try {
        const response = await fetch('/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: inputText }), // Send input to backend
        });
  
        if (response.ok) {
          const result = await response.json();
          alert(`Server Response: ${result.message}`);
        } else {
          alert('Error submitting data.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred.');
      }
    };
  

    const [exams, setUsers] = useState([]); // State to store the list of users
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        async function fetchExams() {
            try {
                const response = await fetch('/openai/response'); // Fetch data from the backend 3000 login
                if (!response.ok) { 
                    throw new Error(`Error: ${response.statusText}`); // Handle HTTP errors
                }
                const data = await response.json(); // Parse the JSON response
                console.log(data); // Log to inspect the structure of the fetched data
                setUsers(data); // Update state with the fetched data
            } catch (err) {
                setError(err.message); // Update error state if there's an issue
            }
        }

        fetchExams();
    }, []); // Empty dependency array to fetch data on component mount

    if (error) {
        return <p>Error fetching users: {error}</p>; // Display error if it occurs
    }



    const [selectedExamId, setSelectedExamId] = useState(null); // Track selected exam_id

    const handleSelectChange = (event) => {
      setSelectedExamId(Number(event.target.value)); // Update the selected exam_id
    };

    const selectedExam = exams.find((exam) => exam.exam_id === selectedExamId); // Find the selected exam



  return (
    <div className={styles.main}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={styles.contentArea}>
        <h1>Import exam</h1>
        <label for="myfile">Select a file: </label>
        <input type="file" id="myfile" name="myfile"></input>

        <label for="cars">Choose a test: </label>

        <select onChange={handleSelectChange}> 
        <option value="" disabled selected>
          Select an exam
        </option>
        {exams.map((exam) => (
          <option key={exam.exam_id} value={exam.exam_id}>
            {exam.title}
          </option>
        ))}
        </select>
     
        <form onSubmit={handleSubmit}>
        
                {/* Display content based on the selected exam */}
      {selectedExam && (
        <div>
          <table className="examdetails">
            <thead>
              <tr>
                <th>Exam ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Created by</th>
                <th>Created on</th>

              </tr>
            </thead>
            <tbody>
              <td>{selectedExam.exam_id}</td>
              <td>{selectedExam.title}</td>
              <td>{selectedExam.description}</td>
              <td>{selectedExam.created_by}</td>
              <td>{selectedExam.created_at}</td>
              
            </tbody>
          </table>
        </div>
      )}
      <label>
        Enter Text:
        <textarea
          className={styles.textarea}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text here..."
          rows={4}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
      </div>
    </div>
  );
}

export default ImportAI;
