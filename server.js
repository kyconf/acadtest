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
    try {
      const users = await getUserInfo();
      res.json(users);
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database connection failed' });
  }
});


app.get('/preview-exams/:examId', async (req, res) => {
  try {
    const { examId } = req.params;
    console.log("Fetching exams for examId:", examId);
    const exams = await getPreviewExams(examId);
    res.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exams.',
      error: error.message,
    });
  }
});


app.get('/exams', async (req, res) =>  { //gets the info
  try {
    const exams = await getExams();
    res.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ message: 'Failed to fetch exams' });
  }
});

app.post('/exams', async (req, res) =>  { //initially for creating exams but not updating
    const { title, description, duration } = req.body;

    try {
        console.log('Creating exam:', { title, description, duration });
        const result = await createExam(title, description, duration);
        
        // Release connection explicitly if needed
        if (result.connection) result.connection.release();
        
        res.status(201).json({ 
            message: 'Exam created successfully!', 
            result: {
                exam_id: result.insertId,
                title,
                description,
                duration
            }
        });
    } catch (error) {
        console.error('Error creating exam:', error);
        res.status(500).json({ 
            message: 'Error creating exam!', 
            error: error.message 
        });
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


app.put('/preview-exams/:examId', async (req, res) =>  {
  const { section, module, number, prompt, passage, choice_A, choice_B, choice_C, choice_D, correct_answer } = req.body;
  const { examId } = req.params;
  try {
      const result = await updateExam(examId, section, module, number, prompt, passage, choice_A, choice_B, choice_C, choice_D, correct_answer);
      res.status(201).json({ message: 'Exam updated successfully', result });
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
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'auth_db',
  port: process.env.DB_PORT || 3050,
}).promise();

// Add connection pool error handling
db.on('error', function(err) {
    console.error('Database pool error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Attempting to reconnect to database...');
        // Attempt to reconnect
        testConnection();
    }
});

  async function getUserInfo() {
    const [rows] = await db.query("SELECT * FROM users"); // make sure its the same name in mysql
    return rows;
  }

  
  async function getQuestions() { //only temporary
    const [rows] = await db.query("SELECT * FROM questions"); // make sure its the same name in mysql
    return rows;
  }


  async function getExams() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          exam_id,
          title,
          description,
          assigned_to,
          duration
        FROM 
          exams
        ORDER BY 
          exam_id ASC
      `);
      return rows;
    } catch (error) {
      console.error('Error in getExams:', error);
      throw error;
    }
  }

  async function getPreviewExams(examId) {
    const [rows] = await db.execute(`
      SELECT 
        exams.exam_id,
        exams.title AS exam_title,
        exams.description AS exam_description,
        sections.section_id,
        sections.number AS section_number,
        modules.module_id,
        modules.module_name AS module_name,
        questions.id AS question_id,
        questions.prompt AS question_prompt,
        questions.number AS question_number,
        questions.passage as question_passage,
        questions.choice_A as question_choice_A,
        questions.choice_B as question_choice_B,
        questions.choice_C as question_choice_C,
        questions.choice_D as question_choice_D,
        questions.correct_answer AS correct_answer
      FROM 
        exams
      INNER JOIN 
        sections ON exams.exam_id = sections.exam_id
      INNER JOIN 
        modules ON sections.section_id = modules.section_id
      INNER JOIN 
        questions ON modules.module_id = questions.module_id
      WHERE 
        exams.exam_id = ?
      ORDER BY
        questions.number ASC
    `, [examId]);

    return rows;
  }

  async function testConnection() {
    try {
        await db.query('SELECT 1');
        console.log("Connected to MySQL database.");
    } catch (err) {
        console.error("Error connecting to MySQL:", err);
        return false;
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

async function updateExam(
  examId,
  sectionId,
  moduleId,
  number,
  prompt,
  passage,
  choice_A,
  choice_B,
  choice_C,
  choice_D,
  correct_answer
) {

  console.log("Received parameters:", {
    examId,
    sectionId,
    moduleId,
    number,
    prompt,
    passage,
    choice_A,
    choice_B,
    choice_C,
    choice_D,
    correct_answer,
  });
  let connection;
  try {
    // Get a connection from the pool
    connection = await db.getConnection();
    
    // Start a transaction
    await connection.beginTransaction();

    // Ensure the exam exists
    await connection.execute(
      `
      INSERT INTO exams (exam_id, title, description)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description);
      `,
      [examId, `Exam ${examId}`, `Description for Exam ${examId}`]
    );

    // Ensure the section exists
    await connection.execute(
      `
      INSERT INTO sections (section_id, exam_id, number)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        exam_id = VALUES(exam_id),
        number = VALUES(number);
      `,
      [sectionId, examId, 1] // Assuming section number is 1 for simplicity
    );

    // Ensure the module exists
    await connection.execute(
      `
      INSERT INTO modules (module_id, section_id, number, module_name)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        section_id = VALUES(section_id),
        number = VALUES(number),
        module_name = VALUES(module_name);
      `,
      [moduleId, sectionId, 1, `Module ${moduleId}`] // Assuming module number is 1 for simplicity
    );

    // Update or insert the question
    const [result] = await connection.execute(
      `
      INSERT INTO questions (
        section, module_id, number, passage, prompt,
        choice_A, choice_B, choice_C, choice_D, correct_answer
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        module = VALUES(module),
        number = VALUES(number),
        passage = VALUES(passage),
        prompt = VALUES(prompt),
        choice_A = VALUES(choice_A),
        choice_B = VALUES(choice_B),
        choice_C = VALUES(choice_C),
        choice_D = VALUES(choice_D),
        correct_answer = VALUES(correct_answer);
      `,
      [
        sectionId, // Assuming `id` is the question number
        moduleId,
        number,
        passage,
        prompt,
        choice_A,
        choice_B,
        choice_C,
        choice_D,
        correct_answer,
      ]
    );

    // Commit the transaction
    await connection.commit();

    return { success: true, message: "Exam updated successfully.", result };
  } catch (error) {
    // Rollback transaction in case of failure
    if (connection) {
      await connection.rollback();
    }
    console.error("Error updating exam:", error);
    throw error;
  } finally {
    // Ensure the connection is released back to the pool
    if (connection) {
      connection.release();
    }
  }
}


async function createExam(title, description, duration) {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Insert the exam
    const [examResult] = await connection.execute(
      `INSERT INTO exams (title, description, duration)
       VALUES (?, ?, ?)`,
      [title, description, duration]
    );
    const examId = examResult.insertId;

    // Insert default section
    const [sectionResult] = await connection.execute(
      `INSERT INTO sections (exam_id, number)
       VALUES (?, ?)`,
      [examId, 1]
    );
    const sectionId = sectionResult.insertId;

    // Insert default module
    const [moduleResult] = await connection.execute(
      `INSERT INTO modules (section_id, number, module_name)
       VALUES (?, ?, ?)`,
      [sectionId, 1, 'Reading and Writing']
    );
    const moduleId = moduleResult.insertId;

    // Insert empty question
    await connection.execute(
      `INSERT INTO questions (section_id, module_id, number, passage, prompt, choice_A, choice_B, choice_C, choice_D, correct_answer)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sectionId, moduleId, 1, '', '', '', '', '', '', '']
    );

    await connection.commit();
    return examResult;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Add exam assignment endpoint
app.post('/assign-exam', async (req, res) => {
  try {
    const { examId, studentIds } = req.body;
    
    // Validate input
    if (!examId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Insert assignments one by one to handle errors better
    for (const studentId of studentIds) {
      await db.query(`
        INSERT INTO exam_assignments (exam_id, student_id) 
        VALUES (?, ?)
      `, [examId, studentId]);
    }

    res.json({ message: 'Exam assigned successfully' });
  } catch (error) {
    console.error('Error assigning exam:', error);
    res.status(500).json({ message: 'Failed to assign exam: ' + error.message });
  }
});

// Update the getStudents function to match your database structure
async function getStudents() {
  try {
    const [rows] = await db.execute(`
      SELECT 
        users.id,
        users.username,
        users.email,
        users.role
      FROM 
        users
      WHERE 
        users.role = 'Student'
      ORDER BY 
        users.username ASC
    `);
    console.log('Fetched students:', rows);
    return rows;
  } catch (error) {
    console.error('Error in getStudents:', error);
    throw error;
  }
}

// The endpoint stays the same
app.get('/students', async (req, res) => {
  try {
    const students = await getStudents();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  testConnection();
});

// // Add this function to create the table
// async function initializeDatabase() {
//     try {
//         console.log("Starting database initialization...");
//         
//         // Set a timeout for the database operations
//         const timeout = setTimeout(() => {
//             console.error("Database initialization timed out");
//             process.exit(1);
//         }, 25000); // 25 second timeout

//         // Users table
//         await db.query(`
//             CREATE TABLE IF NOT EXISTS users (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 username VARCHAR(255) UNIQUE NOT NULL,
//                 password VARCHAR(255) NOT NULL,
//                 email VARCHAR(255) UNIQUE NOT NULL,
//                 created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
//             )
//         `);
//         console.log("Users table checked/created");

//         // Exams table - create this after users table is confirmed
//         await db.query(`
//             CREATE TABLE IF NOT EXISTS exams (
//                 exam_id INT AUTO_INCREMENT PRIMARY KEY,
//                 title VARCHAR(255) NOT NULL,
//                 module TEXT,
//                 created_by INT,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 duration INT,
//                 FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
//             )
//         `);
//         console.log("Exams table checked/created");

//         // Questions table - create this after exams table is confirmed
//         await db.query(`
//             CREATE TABLE IF NOT EXISTS questions (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 exam_id INT NOT NULL,
//                 section VARCHAR(255) NOT NULL,
//                 module INT,
//                 number INT,
//                 passage TEXT,
//                 content TEXT,
//                 choice_A TEXT,
//                 choice_B TEXT,
//                 choice_C TEXT,
//                 choice_D TEXT,
//                 correct_answer CHAR(1),
//                 FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE
//             )
//         `);
//         console.log("Questions table checked/created");

//         // Clear the timeout since we're done
//         clearTimeout(timeout);
//         
//         console.log("Database initialization completed successfully");
//     } catch (err) {
//         console.error("Error initializing database:", err);
//         // Don't exit the process on error, just log it
//         return false;
//     }
//     return true;
// }

// // Modify how we call initializeDatabase
// const startServer = async () => {
//     try {
//         // Test database connection first
//         await testConnection();
//         
//         // Initialize database
//         const dbInitialized = await initializeDatabase();
//         if (!dbInitialized) {
//             console.warn("Database initialization had issues, but continuing startup...");
//         }

//         // Start the server
//         const PORT = process.env.PORT || 3000;
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     } catch (error) {
//         console.error("Failed to start server:", error);
//         process.exit(1);
//     }
// };

// // Call the start function
// startServer();

