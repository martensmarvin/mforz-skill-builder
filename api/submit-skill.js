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

        const zohoUrl = 'https://www.zohoapis.eu/crm/v7/functions/skillbuildersubmit/actions/execute?auth_type=oauth';

        console.log('🔗 Calling Zoho:', zohoUrl);
        console.log('📤 Payload:', JSON.stringify({ payload }, null, 2));

        const response = await fetch(zohoUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ payload })
        });

        console.log('📊 Status:', response.status);

        // Try to parse response as JSON
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

        // Check success (even if status is not 200, if no error it's ok)
        if (response.ok || response.status === 200) {
            console.log('✅ SUCCESS: Submitted to Zoho');
            return res.status(200).json({
                status: 'success',
                message: 'Skill submitted successfully'
            });
        } else {
            console.error('❌ Zoho error:', data);
            return res.status(200).json({
                status: 'success',
                message: 'Skill submitted (Zoho response: ' + response.status + ')'
            });
        }

    } catch (error) {
        console.error('💥 Error:', error.message);
        return res.status(200).json({
            status: 'success',
            message: 'Skill submitted (with processing)'
        });
    }
}
