CREATE DATABASE auth_db;
USE auth_db;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT NOW()
);
INSERT INTO users (username, password) 

VALUES ('john_doe', 'password123');

SELECT * FROM users; -- show info in tables
ALTER TABLE users ADD created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
DESCRIBE users; -- show tables
INSERT INTO users (username, password) 
VALUES ('kyle_fernandez', 'password');
DELETE FROM users WHERE id = 2; 
ALTER TABLE users AUTO_INCREMENT = 2;
INSERT INTO users (username, password) 
VALUES ('student1', 'huzzshhh');
ALTER TABLE users
ADD email VARCHAR(255); -- add column
UPDATE users
SET email = CONCAT(username, '@example.com')
WHERE email IS NULL AND id > 0;
ALTER TABLE users
MODIFY email VARCHAR(255) UNIQUE NOT NULL;

CREATE TABLE exams (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INT NOT NULL, -- Links to Users table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(id) ON DELETE CASCADE
);

DESCRIBE exams; -- show tables
ALTER TABLE exams MODIFY COLUMN created_by INT NULL;

INSERT INTO exams (title) 
VALUES ('practice1');

INSERT INTO exams (title, description) 
VALUES ('practice1', 'A placeholder assignment');


SELECT * FROM exams; -- show info in tables

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL, -- Links to exams.id
    section VARCHAR(255) NOT NULL,
    module INT, -- reading&writing / math
    number INT,
    passage TEXT,
    content TEXT,
    choice_A TEXT,
    choice_B TEXT,
    choice_C TEXT,
    choice_D TEXT,
    correct_answer CHAR(1), -- Correct answer (e.g., A, B, C, D)
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE
);

INSERT INTO questions (exam_id, section, module, number, passage, content, choice_A, choice_B, choice_C, choice_D, correct_answer)
VALUES 
(1, 'Section 1', 1, 1, 'This is a sample passage.', 'What is the answer?', 'Option A', 'Option B', 'Option C', 'Option D', 'A');

DESCRIBE questions;
SELECT * FROM questions; -- show info in tables

ALTER TABLE exams
RENAME COLUMN description to module;

DESCRIBE exams;
ALTER TABLE exams
ADD duration INT; -- add column	