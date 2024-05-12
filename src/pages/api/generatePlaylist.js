const tokenManager = require('./tokenManager'); 
const axios = require('axios');

export default async function generatePlaylist(req, res) {
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

        const responseSongs = await axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=2', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        const topSongs = responseSongs.data.items.map(song => song.id);
        const responseArtists = await axios.get('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=2', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const topArtists = responseArtists.data.items.map(artist => artist.id);
        const queryParams = new URLSearchParams({
            limit: 10, 
            market: 'US', 
            seed_artists: topArtists.join(','),
            seed_songs: topSongs.join(','),
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

        //const recommendedURIS = responseRecommendations.data.tracks.map(track => track.uri);
        //const formattedURIs = recommendedURIS.map(uri => 'spotify:track:' + uri.split(':').pop());
        //uris = formattedURIs.join(',');

        const playlistData = {
            playlistID: playlistID,
            tracks: recommendedTracks
        };

        res.json(playlistData);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};