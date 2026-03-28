export default async function handler(req, res) {
    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { payload } = req.body;
        
        console.log('📥 Received payload:', JSON.stringify(payload, null, 2));

        // Validate required fields
        if (!payload || !payload.name || !payload.email || !payload.skill_md || !payload.skill_name) {
            console.error('❌ Missing required fields');
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: name, email, skill_md, or skill_name'
            });
        }

        // Zoho CRM Function URL
        const zohoUrl = 'https://www.zohoapis.eu/crm/v7/functions/skillbuildersubmit/actions/execute?auth_type=oauth';

        console.log('🔗 Calling Zoho URL:', zohoUrl);
        console.log('📤 Sending payload:', JSON.stringify({ payload }, null, 2));

        // Call Zoho CRM Function
        const response = await fetch(zohoUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ payload })
        });

        console.log('📊 Zoho response status:', response.status);

        const data = await response.json();
        console.log('📄 Zoho response data:', JSON.stringify(data, null, 2));

        // Check if Zoho returned success
        if (response.ok || (data && data.code === 1)) {
            console.log('✅ SUCCESS: Skill record created');
            return res.status(200).json({
                status: 'success',
                message: 'Skill saved successfully',
                skillId: data.id
            });
        } else {
            console.error('❌ Zoho error:', data);
            return res.status(response.status || 400).json({
                status: 'error',
                message: data.message || 'Failed to save skill in Zoho CRM',
                zohoResponse: data
            });
        }

    } catch (error) {
        console.error('💥 Server error:', error.message);
        return res.status(500).json({
            status: 'error',
            message: 'Server error: ' + error.message
        });
    }
}
```

**Stap 1:** Select all (Ctrl+A) → Delete
**Stap 2:** Paste code boven
**Stap 3:** Commit: `fix: clean fresh setup with correct field mappings`
**Stap 4:** Commit directly to main

---

### **3️⃣ TEST**

**Wacht 2 minuten** → Vercel redeploy

**Dan test:**
```
https://mforz-skill-builder.vercel.app
Hard refresh: Ctrl+Shift+R
Fill form + submit
Check console (F12): ✅ or ❌
Check Zoho CRM: Nieuw record?
