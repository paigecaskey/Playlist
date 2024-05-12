const tokenManager = require('./tokenManager'); 
const axios = require('axios');

export default async function addSong(req, res) {
    const accessToken = await tokenManager.getStoredAccessToken();
    const { songURI, playlistID } = req.body;
    console.log(songURI, playlistID, accessToken);

try{
    const requestBodyAddTracks = {
        position: 0,
        uris: [songURI]
    };
    const responsePlaylistAdd = await axios.post(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, requestBodyAddTracks, {
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json' 
        }    
    });

    res.status(200).json({ message: 'Playlist created and songs added successfully' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
  