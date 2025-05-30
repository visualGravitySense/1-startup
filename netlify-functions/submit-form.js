exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Send email notification (replace with your email service)
    // Example: using Netlify Forms or EmailJS
    
    // Log the submission (for now)
    console.log('New course enrollment:', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      experience: data.experience || 'Not specified',
      motivation: data.motivation || 'Not provided',
      timestamp: new Date().toISOString()
    });

    // You can add integrations here:
    // - Send to CRM (HubSpot, Pipedrive)
    // - Send notification email
    // - Add to Google Sheets
    // - Send to Telegram bot

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Заявка принята! Мы свяжемся с вами в ближайшее время.' 
      })
    };

  } catch (error) {
    console.error('Form submission error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 