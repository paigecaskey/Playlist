import styles from './SongCard.module.css';


const SongCard = ({ title, artist, albumImageUrl }) => {
    return (
      <div className={styles['song-card']}>
        <img src={albumImageUrl} alt="Album Cover" className={styles['album-image']} />
        <div className={styles['song-details']}>
          <p className={styles['song-title']}>{title}</p>
          <p className={styles['song-artist']}>{artist}</p>
        </div>
      </div>
    );
  };
  
export default SongCard;
