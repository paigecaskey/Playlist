import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SongCard from '../components/SongCard';
import styles from './generatePlaylist.module.css';

const GeneratePlaylist = () => {
  const [topSongs, setTopSongs] = useState([]);
  const [playlistID, setplaylistID] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedSongs, setAddedSongs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true); 
      const Songresponse = await axios.get('/api/recommendedSongs');
      setTopSongs(Songresponse.data.tracks);
      const Playlistresponse = await axios.get('/api/playlist');
      setplaylistID(Playlistresponse.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async() => {
    try {
      setLoading(true); 
      const Songresponse = await axios.get('/api/recommendedSongs');
      setTopSongs(Songresponse.data.tracks);
      console.log(playlistID);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (song) => {
    const songTitle = song.title;
    const songURI = song.uri;
    setAddedSongs([...addedSongs, songTitle]);
    try {
      await axios.post('/api/addSong', { songURI, playlistID });;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1 className={styles['header']}>Recommended Songs</h1>
      <div className={styles['button-container']}>
      <a href="/finish" className={styles['button']}>Finish</a>
        <button onClick={handleRefresh} className={styles['button']}>Refresh</button>
      </div>
      <div>
            <h2 className={styles['header']}>Added Songs</h2>
            <ul>
              {addedSongs.map((song, index) => (
                <li key={index}>{song}</li>
              ))}
            </ul>
          </div>
      {loading ? (
        <p className={styles['message']}>Loading...</p>
      ) : (
        <>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {topSongs.map((song, index) => (
              <li key={index}>
                <SongCard 
                  title={song.title}
                  artist={song.artist}
                  albumImageUrl={song.albumImageUrl}
                  onAdd={() => handleAdd(song)}
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

