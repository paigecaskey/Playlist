import crypto from 'crypto';
import querystring from 'querystring';
import dotenv from 'dotenv';

dotenv.config();

const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.randomBytes(length);
    return Array.from(values)
        .map((byte) => possible[byte % possible.length])
        .join('');
};

export default async function handler(req, res) {
  const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URL;
  const SCOPE = 'user-top-read playlist-modify-public playlist-modify-private playlist-read-private';

  if (req.method === 'GET') {
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
  } else {
    res.status(405).end();
  }
}

