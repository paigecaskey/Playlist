const tokenManager = require('./tokenManager');
const axios = require('axios');

async function getRandomItems(array, count) {
    const randomItems = [];
    while (randomItems.length < count) {
        const randomIndex = Math.floor(Math.random() * array.length);
        const randomItem = array[randomIndex];
        if (!randomItems.includes(randomItem)) {
            randomItems.push(randomItem);
        }
    }
    return randomItems;
}

export default async function recommendedSongs(req, res) {
    try {
        const accessToken = await tokenManager.getStoredAccessToken();

        const responseSongs = await axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=20', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        const topSongs = responseSongs.data.items.map(song => song.id);
        const responseArtists = await axios.get('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=20', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const topArtists = responseArtists.data.items.map(artist => artist.id);
        
        const seedSongs = await getRandomItems(topSongs, 2);
        const seedArtists = await getRandomItems(topArtists, 2);

        const queryParams = new URLSearchParams({
            limit: 10,
            market: 'US',
            seed_artists: seedArtists,
            seed_songs: seedSongs,
        });

        const url = `https://api.spotify.com/v1/recommendations?${queryParams}`;
        const responseRecommendations = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const recommendedTracks = responseRecommendations.data.tracks.map(track => ({
            id: track.id,
            uri: track.uri,
            albumImageUrl: track.album.images[0].url,
            artist: track.artists.map(artist => artist.name).join(', '),
            title: track.name,
        }));

        const playlistData = {
            tracks: recommendedTracks
        };

        res.json(playlistData);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
