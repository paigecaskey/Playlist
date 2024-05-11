const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');
const express = require('express');
const querystring = require('querystring');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URL;
const SCOPE = 'user-top-read playlist-modify-public playlist-modify-private playlist-read-private';
let accessToken = null;
let uris = null;

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.randomBytes(length);
    return Array.from(values)
        .map((byte) => possible[byte % possible.length])
        .join('');
};

app.get('/login', async (req, res) => {
    const state = generateRandomString(16);
    const authUrl = `https://accounts.spotify.com/authorize?` +
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: SCOPE,
            redirect_uri: REDIRECT_URI,
            state: state
        });
    res.json({ authUrl });
});

app.get('/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            params: {
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
            }
        });

        accessToken = response.data.access_token;
        res.json({ accessToken });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/generatePlaylist', async (req, res) => {
    try {
        const responseSongs = await axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=2', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
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
            albumImageUrl: track.album.images[0].url,
            artist: track.artists.map(artist => artist.name).join(', '),
            title: track.name,

        }));

        const recommendedURIS = responseRecommendations.data.tracks.map(track => track.uri);
        const formattedURIs = recommendedURIS.map(uri => 'spotify:track:' + uri.split(':').pop());
        uris = formattedURIs.join(',');

        res.json(recommendedTracks);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/createPlaylist', async (req, res) => {
    try {
        const responseUser = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const userID = responseUser.data.id;

        const requestBody = {
            name: 'Your Coolest Playlist',
            public: true, 
            collaborative: false, 
            description: 'Your description here' 
        };

        const responsePlaylist = await axios.post(`https://api.spotify.com/v1/users/${userID}/playlists`, requestBody, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json' 
            }
        });

        const playlistID = responsePlaylist.data.id;

        const requestBodyAddTracks = {
            position: 0,
            uris: uris.split(',')
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
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
