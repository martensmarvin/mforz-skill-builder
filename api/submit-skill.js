export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { payload } = req.body;
        console.log('📥 Received:', JSON.stringify(payload, null, 2));

        const zohoToken = process.env.ZOHO_API_TOKEN;
        if (!zohoToken) {
            return res.status(500).json({ status: 'error', message: 'ZOHO_API_TOKEN not configured' });
        }

        const zohoUrl = 'https://www.zohoapis.eu/crm/v7/functions/skillbuildersubmit/actions/execute';

        const response = await fetch(zohoUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Zoho-oauthtoken ${zohoToken}`
            },
            body: JSON.stringify({ payload })
        });

        const text = await response.text();
        console.log('📊 Zoho status:', response.status);
        console.log('📄 Zoho response:', text);

        let data;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        if (response.ok) {
            return res.status(200).json({ status: 'success', data });
        } else {
            return res.status(response.status).json({ status: 'error', zohoResponse: data });
        }

    } catch (error) {
        console.error('💥 Error:', error.message);
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
