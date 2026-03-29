export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { payload } = req.body;
        
        console.log('📥 Received payload:', JSON.stringify(payload, null, 2));

        if (!payload || !payload.name || !payload.email || !payload.skill_md || !payload.skill_name) {
            console.error('❌ Missing required fields');
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields'
            });
        }

        // Get API token from environment variable
        const zohoToken = process.env.ZOHO_API_TOKEN;
        if (!zohoToken) {
            console.error('❌ ZOHO_API_TOKEN not set in environment');
            return res.status(500).json({
                status: 'error',
                message: 'Server configuration error: Missing ZOHO_API_TOKEN'
            });
        }

        const zohoUrl = 'https://www.zohoapis.eu/crm/v7/functions/skillbuildersubmit/actions/execute';

        console.log('🔗 Calling Zoho:', zohoUrl);
        console.log('📤 Payload:', JSON.stringify({ payload }, null, 2));
        console.log('🔐 Using token:', zohoToken.substring(0, 20) + '...');

        const response = await fetch(zohoUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Zoho-oauthtoken ${zohoToken}`
            },
            body: JSON.stringify({ payload })
        });

        console.log('📊 Status:', response.status);

        let data;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.log('⚠️ Response is not JSON, raw text:', text);
            data = { rawResponse: text };
        }

        console.log('📄 Response data:', JSON.stringify(data, null, 2));

        if (response.ok || response.status === 200) {
            console.log('✅ SUCCESS: Skill created in Zoho CRM');
            return res.status(200).json({
                status: 'success',
                message: 'Skill saved successfully',
                data: data
            });
        } else {
            console.error('❌ Zoho error:', data);
            return res.status(response.status || 400).json({
                status: 'error',
                message: data.message || 'Failed to save skill',
                zohoResponse: data
            });
        }

    } catch (error) {
        console.error('💥 Error:', error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Server error: ' + error.message
        });
    }
}
