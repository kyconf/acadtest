import React from 'react';
import styles from './Header.module.css';
import student from '../assets/student.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.profileSection}>
        
        <span className={styles.profileText}>Admin</span>
        
        <img 
          src={student}
          alt="Profile" 
          className={styles.profileImage}
        />
      </div>
    </header>
  );
}

export default Header;
