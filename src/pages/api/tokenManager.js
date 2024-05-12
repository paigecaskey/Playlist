const axios = require('axios');
const querystring = require('querystring');

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URL;


async function getAccessToken(code) {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            querystring.stringify({
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            }),
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
                }
            }
        );
        process.env.SPOTIFY_ACCESS_TOKEN = response.data.access_token;
        process.env.SPOTIFY_REFRESH_TOKEN = response.data.refresh_token;
        return process.env.SPOTIFY_ACCESS_TOKEN;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to obtain access token');
    }
}

async function refreshAccessToken() {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            querystring.stringify({
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            }),
            {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
                }
            }
        );

        process.env.SPOTIFY_ACCESS_TOKEN = response.data.access_token;
        return process.env.SPOTIFY_ACCESS_TOKEN;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to refresh access token');
    }
}

function getStoredAccessToken() {
    return process.env.SPOTIFY_ACCESS_TOKEN;
}

module.exports = {
    getAccessToken,
    getStoredAccessToken
};

