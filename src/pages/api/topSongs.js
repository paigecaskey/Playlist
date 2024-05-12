const tokenManager = require('./tokenManager'); 
const axios = require('axios');

export default async function topSongs(req, res) {
    try {
        const accessToken = await tokenManager.getStoredAccessToken();

        const responseSongs = await axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=20', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        const topSongs = responseSongs.data.items.map(song => song.id);

        res.json(topSongs);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};