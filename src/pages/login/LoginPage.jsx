import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import styles from './LoginPage.module.css'

function LoginPage() {
  const navigate = useNavigate();
  
  const navButton = () => {
      navigate('/');
  };

  const [users, setUsers] = useState([]); 
  const [error, setError] = useState(null); 
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
    // Add edit logic here
  };

  const handleAssign = (userId) => {
    console.log('Assign user:', userId);
    // Add assign logic here
  };

  const handleDelete = (userId) => {
    console.log('Delete user:', userId);
    // Add delete logic here
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('http://localhost:3000/login');
        if (!response.ok) { 
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchUsers();
  }, []);

  if (error) {
    return <p>Error fetching users: {error}</p>;
  }
  
  return (
    <div className={styles.main}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={styles.contentArea}>
        <div className={styles.twrapper}>
          <table className={styles.examlist}>
            <thead>
              <tr className={styles.header}>
                <th>
                  <input
                    type="checkbox"
                    className={styles.uicheckbox}
                    checked={selectedUsers.length === users.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Username</th>
                <th>ID</th>
                <th>Email</th>
                <th>Password</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={styles.examRow}>
                  <td>
                    <input
                      type="checkbox"
                      className={styles.uicheckbox}
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.id}</td>
                  <td>{user.email || "No Email"}</td>
                  <td>{user.password}</td>
                  <td>{user.created}</td>
                  <td className={styles.actionButtons}>
                    <button 
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      onClick={() => handleEdit(user.id)}
                    >
                      Edit
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${styles.assignBtn}`}
                      onClick={() => handleAssign(user.id)}
                    >
                      Assign
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={navButton}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
