const tokenManager = require('./tokenManager'); 
const axios = require('axios');

export default async function playlist(req, res) {
    try {
        const accessToken = await tokenManager.getStoredAccessToken();
        const responseUser = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const userID = responseUser.data.id;
        const requestBody = {
            name: 'Really Cool Playlist',
            public: true, 
            collaborative: false, 
            description: 'meep' 
        };
        const responsePlaylist = await axios.post(`https://api.spotify.com/v1/users/${userID}/playlists`, requestBody, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json' 
            }
        });
        const playlistID = responsePlaylist.data.id;
        console.log('Playlist created with ID:', playlistID);

        res.json(playlistID);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};