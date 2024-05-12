import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from './callback.module.css';

const Callback = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); 
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');
        const response = await axios.get(`/api/callback?code=${code}`);
        if (response.data && response.data.accessToken) {
            setAccessToken(response.data.accessToken);
          }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  const handleGeneratePlaylist = () => {
    router.push('/generatePlaylist');
  };

  const handleRedirectToIndex = () => {
    router.push('/');
  };

  return (
    <div className={styles['return-container']}>
      {loading ? (
        <p className={styles['loading']}>Loading...</p>
      ) : (
        <div>
          {accessToken ? (
            <>
              <div className={styles['message-container']}><p className={styles['success']}>Success</p></div>
              <button onClick={handleGeneratePlaylist} className={styles['button']}>Generate Playlist</button>
            </>
          ) : (
            <>
              <div className={styles['message-container']}><p className={styles['fail']}>Authentication Failed</p></div>
              <button onClick={handleRedirectToIndex} className={styles['button']}>Go Back Home</button>
            </>
          )}
        </div>
      )}
    </div>
  );
  
};

export default Callback;













 



