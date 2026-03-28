export default async function handler(req, res) {
    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { payload } = req.body;
        
        // Log for debugging
        console.log('📥 Received payload:', JSON.stringify(payload, null, 2));

        // Validate payload
        if (!payload || !payload.name || !payload.email || !payload.skill_md) {
            console.error('❌ Missing required fields in payload');
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: name, email, or skill_md'
            });
        }

        // Zoho CRM Function URL (directly calling the function)
        // NOTE: We're using the direct function URL without auth_type parameter
        const zohoUrl = 'https://www.zohoapis.eu/crm/v7/functions/skillbuildersubmit/actions/execute';

        console.log('🔗 Calling Zoho URL:', zohoUrl);
        console.log('📤 Payload being sent:', JSON.stringify(payload, null, 2));

        // Call Zoho CRM Function
        const response = await fetch(zohoUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ payload })
        });

        console.log('📊 Zoho response status:', response.status);
        console.log('📋 Zoho response headers:', Object.fromEntries(response.headers));

        const data = await response.json();
        
        console.log('📄 Zoho response data:', JSON.stringify(data, null, 2));

        // Check if Zoho returned success
        if (response.ok || data.code === 1) {
            console.log('✅ SUCCESS: Skill record created');
            return res.status(200).json({
                status: 'success',
                message: 'Skill saved successfully',
                data: data
            });
        } else {
            console.error('❌ Zoho returned error:', data);
            return res.status(response.status || 400).json({
                status: 'error',
                message: data.message || 'Failed to save skill in Zoho CRM',
                zohoData: data
            });
        }

    } catch (error) {
        console.error('💥 Catch block error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        return res.status(500).json({
            status: 'error',
            message: 'Server error: ' + error.message,
            details: error.toString()
        });
    }
}
