import React from 'react';
import styles from './finish.module.css';

const FinishPage = () => {
  return (
    <div className={styles['button-container']}>
      <h1 className={styles['header']}>Playlist made!</h1>
      <a href="/" className={styles['button']}>Back to Home</a>
    </div>
  );
};

export default FinishPage;
