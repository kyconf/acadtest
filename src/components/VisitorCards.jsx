import React from 'react';
import styles from './VisitorCards.module.css'; // Create a CSS module for styling if needed

const VisitorCards = () => {
  return (
    <div className={styles.wrapper2}>
      <div className={styles.card}>
        <div className={styles.content}>
          <p className={styles.heading}>Currently enrolled</p>
          <p className={styles.para}>512</p>
          <p className={styles.heading}>(2023~2024)</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.content}>
          <p className={styles.heading}>Monthly visitors</p>
          <p className={styles.para}>16,372</p>
          <p className={styles.heading}>(2023~2024)</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.content}>
          <p className={styles.heading}>Weekly visitors</p>
          <p className={styles.para}>4,982</p>
          <p className={styles.heading}>(2023~2024)</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.content}>
          <p className={styles.heading}>Total students</p>
          <p className={styles.para}>1,213</p>
          <p className={styles.heading}>(2023~2024)</p>
        </div>
      </div>
    </div>
  );
};

export default VisitorCards; 