import mysql from "mysql2"; // Import mysql2

// This entire section is for connecting to the database itself. Please place info into .env file later.
const db = mysql.createPool({
    host: "localhost",
    user: "root", // Your MySQL username
    password: "myr00tp4$$w0rdus3r", // Your MySQL password rootuser sqlacadsite$12
    database: "auth_db", // Your database name
    port: 3050,
  }).promise();


  export async function getUserInfo() {
    const [rows] = await db.query("SELECT * FROM users"); // make sure its the same name in mysql
    return rows;
  }

export async function testConnection() {
    try {
        await db.query('SELECT 1');
        console.log("Connected to MySQL database.");
    } catch (err) {
        console.error("Error connecting to MySQL:", err);
    }
}

export async function getUser(id) { //get specific user by putting a parameter
    const [rows] = await db.query(`
        SELECT * 
        FROM users
        WHERE id = ?
         `, [id]); // make sure its the same name in mysql
    return rows[0];
}

export async function regist(username, password) { //get specific user by putting a parameter
    const result = await db.query(`
        INSERT INTO users (username, password)
        VALUES (?, ?)
         `, [username, password]); // make sure its the same name in mysql
    return result;
}


(async () => {
    // Test the connection
    await testConnection();
  const users = await getUserInfo();
  
  console.log(users)
})();
  


