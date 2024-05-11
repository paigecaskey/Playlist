import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SongCard from '../components/SongCard';
import styles from './generatePlaylist.module.css';

const GeneratePlaylist = () => {
  const [topSongs, setTopSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true); 
      const response = await axios.get('http://localhost:3001/generatePlaylist');
      setTopSongs(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlaylist = async () => {
    try {
      setLoading(true); 
      const response = await axios.post('http://localhost:3001/createPlaylist');
      setMessage(response.data.message); 
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div>
      <h1 className={styles['header']}>Recommended Songs</h1>
      <div className={styles['button-container']}>
        <button onClick={handleAddPlaylist} className={styles['button']}>Create + Add To Playlist</button>
        <button onClick={handleRefresh} className={styles['button']}>Refresh</button>
      </div>
      {loading ? (
        <p className={styles['message']}>Loading...</p>
      ) : (
        <>
          <p className={styles['message']}>{message}</p>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {topSongs.map((song, index) => (
              <li key={index}>
                <SongCard 
                  title={song.title}
                  artist={song.artist}
                  albumImageUrl={song.albumImageUrl}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default GeneratePlaylist;

