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


app.get('/preview-exams/:examId', async (req, res) =>  { //gets the info
  try {
    // Fetch data from the database
    console.log("Fetching exams...");
    const exams = await getPreviewExams();
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
        console.log('Creating exam:', { title, module, duration });
        const result = await createExam(title, module, duration);
        
        // Release connection explicitly if needed
        if (result.connection) result.connection.release();
        
        res.status(201).json({ 
            message: 'Exam created successfully!', 
            result: {
                exam_id: result.insertId,
                title,
                module,
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
        const [rows] = await db.query(`
            SELECT 
                exam_id, 
                title, 
                description, 
                assigned_to,  
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at, 
                duration 
            FROM exams
            ORDER BY created_at ASC
            LIMIT 100
        `);
        return rows;
    } catch (error) {
        console.error('Error in getExams:', error);
        throw error;
    }
  }

  async function getPreviewExams() {
    try {
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
                questions ON modules.module_id = questions.module
            WHERE 
                exams.exam_id = 1 AND
                sections.section_id = 1 AND
                modules.module_id = 1;
        `);
        return rows;
    } catch (error) {
        console.error('Error in getExams:', error);
        throw error;
    }
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

async function createExam(title, module, duration) { //get specific user by putting a parameter
  const result = await db.query(`
      INSERT INTO exams (title, description, duration)
      VALUES (?, ?, ?)
       `, [title, description, duration]); // make sure its the same name in mysql
  return result;
}


// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   testConnection();
// });


async function initializeDatabase() {
  try {
    console.log("Starting database initialization...");

    // Create the database if it doesn't exist
    await db.query("CREATE DATABASE IF NOT EXISTS auth_db");
    await db.query("USE auth_db");

    // Create the `users` table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created TIMESTAMP NOT NULL DEFAULT NOW(),
        name VARCHAR(255) NOT NULL
      )
    `);
    console.log("Users table checked/created.");

    // Insert sample data into `users` table
    await db.query(`
      INSERT IGNORE INTO users (username, password, email, name)
      VALUES
      ('john_doe', 'password123', 'kyconf@gmail.com', 'John Doe'),
      ('jane_doe', 'password456', 'keycolinf@gmail.com', 'Jane Doe'),
      ('administrator', 'admin', 'kyconf@yorku.ca', 'Kyle Fernandez');
    `);
    console.log("Sample data inserted into users table.");

    // Create the `exams` table
    await db.query(`
      CREATE TABLE IF NOT EXISTS exams (
        exam_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        assigned_to INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("Exams table checked/created.");

    // Insert sample data into `exams` table
    await db.query(`
      INSERT IGNORE INTO exams (title, description, assigned_to)
      VALUES
      ('Math Exam', 'A basic mathematics exam covering algebra, geometry, and arithmetic.', 1),
      ('Science Quiz', 'A short quiz testing knowledge of basic physics, chemistry, and biology.', 2),
      ('History Test', 'A comprehensive test on world history, focusing on ancient civilizations.', 3);
    `);
    console.log("Sample data inserted into exams table.");

    // Create the `sections` table
    await db.query(`
      CREATE TABLE IF NOT EXISTS sections (
        section_id INT AUTO_INCREMENT PRIMARY KEY,
        exam_id INT NOT NULL,
        number INT NOT NULL,
        FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE
      )
    `);
    console.log("Sections table checked/created.");

    // Insert sample data into `sections` table
    await db.query(`
      INSERT IGNORE INTO sections (exam_id, number)
      VALUES
      (1, 1);
    `);
    console.log("Sample data inserted into sections table.");

    // Create the `modules` table
    await db.query(`
      CREATE TABLE IF NOT EXISTS modules (
        module_id INT AUTO_INCREMENT PRIMARY KEY,
        section_id INT NOT NULL,
        number INT NOT NULL,
        module_name VARCHAR(255) NOT NULL,
        FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE
      )
    `);
    console.log("Modules table checked/created.");

    // Insert sample data into `modules` table
    await db.query(`
      INSERT IGNORE INTO modules (section_id, number, module_name)
      VALUES
      (1, 1, 'Reading and Writing');
    `);
    console.log("Sample data inserted into modules table.");

    // Create the `questions` table
    await db.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section VARCHAR(255) NOT NULL,
        module INT,
        number INT,
        passage TEXT,
        prompt TEXT,
        choice_A TEXT,
        choice_B TEXT,
        choice_C TEXT,
        choice_D TEXT,
        correct_answer CHAR(1),
        FOREIGN KEY (module) REFERENCES modules(module_id) ON DELETE CASCADE
      )
    `);
    console.log("Questions table checked/created.");

    // Insert sample data into `questions` table
    await db.query(`
      INSERT IGNORE INTO questions (section, module, number, passage, prompt, choice_A, choice_B, choice_C, choice_D, correct_answer)
      VALUES
      (1, 1, 1, 
       'The sun provides energy essential for life on Earth. It is a vital component of photosynthesis, which allows plants to create oxygen and glucose.',
       'What is the primary role of the sun in the passage?', 
       'To provide light', 'To provide heat', 'To drive photosynthesis', 'To warm the Earth', 'C'),
      (1, 1, 2, 
       'In 1803, the Louisiana Purchase doubled the size of the United States, significantly expanding its territory and paving the way for westward expansion.',
       'What was a result of the Louisiana Purchase?', 
       'It decreased U.S. territory.', 'It doubled U.S. territory.', 'It made Louisiana an independent state.', 'It ended French control in North America.', 'B'),
      (1, 1, 3, 
       'The invention of the printing press in the 15th century revolutionized the spread of information, making books more accessible and promoting literacy.',
       'What was a key impact of the printing press described in the passage?', 
       'It made books expensive.', 'It promoted literacy.', 'It limited access to information.', 'It slowed the spread of ideas.', 'B');
    `);
    console.log("Sample data inserted into questions table.");

    console.log("Database initialization completed successfully.");
    return true;
  } catch (err) {
    console.error("Error initializing database:", err)
    throw err
  }
}

const startServer = async () => {
  try {
    // Test database connection first
    await testConnection();
    
    // Initialize database
    await initializeDatabase(); // No need to check its return value
    
    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};
