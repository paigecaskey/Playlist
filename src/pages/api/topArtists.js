const tokenManager = require('./tokenManager'); 
const axios = require('axios');

export default async function topArtists(req, res) {
    try {
        const accessToken = await tokenManager.getStoredAccessToken();

        const responseArtists = await axios.get('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=20', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const topArtists = responseArtists.data.items.map(artist => artist.id);

        res.json(topArtists);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};