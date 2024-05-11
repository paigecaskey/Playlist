import React from 'react';
import axios from 'axios';
import styles from './index.module.css';

const Home = () => {

  const authenticateWithSpotify = async () => {
    try { 
      const response = await axios.get(`http://localhost:3001/login`);
      const authUrl = response.data.authUrl; 
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error:', error);
    } 
  };

  return (
    <div className={styles['button-container']}>
      <button onClick={authenticateWithSpotify} className={styles['button']}>Authenticate With Spotify</button>
    </div>
  );
};

export default Home;










