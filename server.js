import dotenv from 'dotenv';

import express from 'express';
import mysql from 'mysql2'
import cors from 'cors';
import OpenAI from 'openai';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
const app = express();

app.use(cors()); // Enables CORS for all origins
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true}));


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  
});


// Temporary store for response (simulates a database or session storage)


app.get('/openai/response', async (req, res) =>  { //gets the info

  
  if (lastResponse) {
    res.status(200).json(lastResponse); // Send the stored JSON response
  } else {
    res.status(404).json({
      success: false,
      message: "No response available.",
    });
  }
});


app.get('/', (req, res) =>  {
    res.render('index', { name: 'kyle'}); 
});




app.get('/login', async (req, res) =>  { //gets the info
    const users = await getUserInfo();
  
    res.json(users)
});


app.get('/exams', async (req, res) =>  { //gets the info
  try {
    // Fetch data from the database
    console.log("Fetching exams...");
    const exams = await getExams();
    

    // Combine with the stored OpenAI JSON response
    const combinedExams = [...exams, ...lastResponse]; // Merge the two arrays

    // Optional: Remove duplicates based on 'exam_id'
    const uniqueExams = combinedExams.filter(
      (exam, index, self) =>
        index === self.findIndex((e) => e.exam_id === exam.exam_id)
    );

    // Send the combined response
    res.status(200).json(uniqueExams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exams.',
      error: error.message,
    });
  }
});

app.post('/exams', async (req, res) =>  {
  const { title, module, duration } = req.body;

  try {
      const result = await createExam(title, module, duration);
      res.status(201).json({ message: 'Exam created successfully!', result });
  } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Error registering exam!', error });
  }
  
});


//each a different route

app.post('/login', async (req, res) =>  {
    const { username, password } = req.body;

  try {
    // Use the getUser function to fetch the user's data by username
    const [rows] = await db.query(`
      SELECT username, password
      FROM users
      WHERE username = ?
    `, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = rows[0];

    // Compare the provided password with the one from the database (no hashing here yet)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Return success if validation passes
    res.status(200).json({ message: 'Login successful', user: { username: user.username } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An unexpectedasd error occurred.' });
  }
});

app.get('/register', (req, res) =>  {
    res.render('register');  
});


app.post('/a-register', async (req, res) =>  {
    const { username, password, email } = req.body;

    try {
        const result = await regist(username, password, email);
        res.status(201).json({ message: 'User registered successfully', result });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user: An account already exists with those credentials', error });
    }
    
});


app.get('/importai', async (req, res) =>  {
  const users = await getExams();
  res.json(users)

});

let lastResponse = null;
app.post('/openai', async (req, res) => {

  try {

    const { prompt } = req.body; // Get user input (prompt) from the request body
    console.log('Extracted prompt:', prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Reply only in valid JSON format. No quotation marks or extra text in the response. If no created_at is provided, use the current date and time of the user and format it as follows. Parse exams and their details from the user input into this format:
          [
            {
              "exam_id": 1,
              "title": "practice1",
              "module": "Reading and Writing / Math",
              "created_at": "2024-12-21 22:27:50",
              "duration": "60"
            }
          ]
          If a file is provided, convert its content to JSON. Fill in missing answers if they are absent.`
        },
        { role: "user", content: prompt }
      ]
    });
  
  
  
    let message = response.choices[0]?.message?.content || 'No message returned';
    try {
      if (typeof message === 'string') {
        message = JSON.parse(message); // Parse the stringified JSON into an object
      }
      console.log("Parsed Message:", message);
    } catch (error) {
      console.error("JSON Parsing Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to parse JSON response from OpenAI.",
        rawResponse: message,
      });
    }
    // Append the new response to the existing array
    if (Array.isArray(message)) {
      lastResponse = lastResponse.concat(message); // Merge arrays  
    } else {
      lastResponse.push(message); // Add single object
    }

    res.status(200).json({
      success: true,
      message: "Response generated successfully.",
      data: message,
    });
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to process the request.',
      error: error.response?.data || error.message,
    });
  }

  
});

lastResponse = [
  {
    exam_id: 1,
    title: "Dummy Exam",
    module: "Placeholder description for the exam.",
    created_by: "John Doe",
    created_at: "2024-12-13T00:00:00.000Z"
  }
]; // 

// This entire section is for connecting to the database itself. Please place info into .env file later.
const db = mysql.createPool({
    host: "localhost",
    user: "root", // Your MySQL username
    password: "myr00tp4$$w0rdus3r", // Your MySQL password rootuser sqlacadsite$12
    database: "auth_db", // Your database name
    port: 3050,
  }).promise();


  async function getUserInfo() {
    const [rows] = await db.query("SELECT * FROM users"); // make sure its the same name in mysql
    return rows;
  }

  


  async function getExams() { //get specific user by putting a parameter
    const [rows] = await db.query("SELECT exam_id, title, module, created_by,  DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at, duration FROM exams"); // make sure its the same name in mysql
    return rows;
  }

  async function testConnection() {
    try {
        await db.query('SELECT 1');
        console.log("Connected to MySQL database.");
    } catch (err) {
        console.error("Error connecting to MySQL:", err);
    }
}

async function getUser(username, password) { //get specific user by putting a parameter
    const [rows] = await db.query(`
        SELECT * 
        FROM users
        WHERE username = ? AND password = ?
         `, [username, password]); // make sure its the same name in mysql
    return rows.length > 0; //if i wanna check it exists, >0
}



async function regist(username, password, email) { //get specific user by putting a parameter
    const result = await db.query(`
        INSERT INTO users (username, password, email)
        VALUES (?, ?, ?)
         `, [username, password, email]); // make sure its the same name in mysql
    return result;
}

async function createExam(title, module, duration) { //get specific user by putting a parameter
  const result = await db.query(`
      INSERT INTO exams (title, module, duration)
      VALUES (?, ?, ?)
       `, [title, module, duration]); // make sure its the same name in mysql
  return result;
}


(async () => {
    // Test the connection
    await testConnection();
  const users = await getUserInfo();
  const exams = await getExams();
  console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);
})();
  



app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

