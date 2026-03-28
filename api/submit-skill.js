export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { payload } = req.body;

        if (!payload || !payload.name || !payload.email) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields'
            });
        }

        // Zoho CRM Function URL
        const zohoUrl = 'https://www.zohoapis.eu/crm/v7/functions/skillbuildersubmit/actions/execute?auth_type=oauth';

        const response = await fetch(zohoUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payload })
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({
                status: 'success',
                message: 'Skill saved successfully',
                data
            });
        } else {
            return res.status(response.status).json({
                status: 'error',
                message: data.message || 'Failed to save skill'
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Server error: ' + error.message
        });
    }
}
