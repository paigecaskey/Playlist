const tokenManager = require('./tokenManager');

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { code } = req.query;
            const accessToken = await tokenManager.getAccessToken(code);
            res.json({ accessToken });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).end(); 
    }
}

