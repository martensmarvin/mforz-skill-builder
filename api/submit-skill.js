export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { payload } = req.body;
        console.log('📥 Received:', JSON.stringify(payload, null, 2));

        const zohoUrl = 'https://www.zohoapis.eu/crm/v7/functions/skillbuilderapi/actions/execute?auth_type=apikey&zapikey=1003.bded7296486d59c9fdb79f41f68593cf.d0db53f4d4b0031a3c75be4808b483bd';

        const response = await fetch(zohoUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('📄 Zoho response:', JSON.stringify(data, null, 2));

        if (data.code === 'success') {
            return res.status(200).json({ status: 'success', data });
        } else {
            return res.status(400).json({ status: 'error', zohoResponse: data });
        }

    } catch (error) {
        console.error('💥 Error:', error.message);
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
