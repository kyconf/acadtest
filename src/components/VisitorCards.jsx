import React from 'react';
import styles from './VisitorCards.module.css'; // Create a CSS module for styling if needed

const VisitorCards = () => {
  return (
    <div className={styles.wrapper2}>
      <div className={styles.card}>
        <div className={styles.content}>
          <p className={styles.heading}>Today's visitors</p>
          <p className={styles.para}>1,173</p>
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
          <p className={styles.heading}>Total visitors</p>
          <p className={styles.para}>38,652</p>
          <p className={styles.heading}>(2023~2024)</p>
        </div>
      </div>
    </div>
  );
};

export default VisitorCards; 