CREATE DATABASE auth_db;
USE auth_db;
SELECT * from users;
SELECT * from exams;
SELECT * from sections;
SELECT * from modules;
SELECT * from questions;
DESCRIBE users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT NOW(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE exams (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to INT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE
);
-- within each exam is a section and within each section is a module
SELECT * FROM exams;
DESCRIBE exams;

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




CREATE TABLE sections (
	section_id INT AUTO_INCREMENT PRIMARY KEY, 
    exam_id INT NOT NULL,                     -- Foreign key linking to the exams table    
    number INT NOT NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE 
);

INSERT INTO sections (exam_id, number) VALUES
('1', '1');

DESCRIBE exams;

CREATE TABLE modules (
	module_id INT AUTO_INCREMENT PRIMARY KEY, 
    section_id INT NOT NULL,
    number INT NOT NULL,
    module_name VARCHAR(255) NOT NULL,      
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE 
);


INSERT INTO modules (section_id, number, module_name) VALUES
('1','1','Reading and Writing');

CREATE TABLE questions (
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
    correct_answer CHAR(1), -- Correct answer (e.g., A, B, C, D)
    FOREIGN KEY (module) REFERENCES modules(module_id) ON DELETE CASCADE
);

INSERT INTO users (username, password, email) VALUES
('john_doe', 'password123', 'kyconf@gmail.com'),
('jane_doe', 'password456', 'keycolinf@gmail.com'),
('admin', 'adminpassword', 'kyconf@my.yorku.ca');

INSERT INTO users (username, password, email, name) VALUES
('administrator', 'admin', 'kyconf@yorku.ca', 'Kyle Fernandez');


INSERT INTO exams (title, description, assigned_to) VALUES
('Math Exam', 'A basic mathematics exam covering algebra, geometry, and arithmetic.', 1),
('Science Quiz', 'A short quiz testing knowledge of basic physics, chemistry, and biology.', 2),
('History Test', 'A comprehensive test on world history, focusing on ancient civilizations.', 3);




INSERT INTO questions (section, module, number, passage, prompt, choice_A, choice_B, choice_C, choice_D, correct_answer)
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


	

DESCRIBE users;
