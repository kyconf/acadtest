<?php
session_start();
require_once 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $student_id = $_POST['student_id'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM students WHERE student_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $student_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if (password_verify($password, $row['password'])) {
            $_SESSION['student_id'] = $student_id;
            $_SESSION['student_name'] = $row['username'];
            header("Location: student_dashboard.php");
            exit();
        }
    }
    
    $_SESSION['error'] = "Invalid student ID or password";
    header("Location: login.html");
    exit();
}
?> 