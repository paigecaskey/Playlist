import React, { useState } from 'react';
import styles from './SongCard.module.css';

const SongCard = ({ title, artist, albumImageUrl, onAdd }) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleAddClick = () => {
    if (onAdd) {
      onAdd();
      setButtonDisabled(true); // Disable the button after it's clicked
    }
  };

  return (
    <div className={styles['song-card']}>
      <img src={albumImageUrl} alt="Album Cover" className={styles['album-image']} />
      <div className={styles['song-details']}>
        <p className={styles['song-title']}>{title}</p>
        <p className={styles['song-artist']}>{artist}</p>
        <button onClick={handleAddClick} className={styles['add-button']} disabled={buttonDisabled}>
          {buttonDisabled ? "Added!" : "+"}
        </button>
      </div>
    </div>
  );
};

export default SongCard;


