export const emailConfig = {
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
  confirmationTemplateId: 'YOUR_CONFIRMATION_TEMPLATE_ID',
  publicKey: 'YOUR_PUBLIC_KEY',
};

export const googleSheetsUrl = 'https://script.google.com/macros/s/AKfycbwLNj5Mp_Py6Ktu7848fmJ50LABZoBToj7W5OmHZh-FaQD68fnjsc2KsQBc1_tyIPAK/exec';

export async function submitToGoogleSheets(data, type = 'lead') {
  try {
    const response = await fetch(googleSheetsUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain', // Using text/plain avoids CORS preflight issues with Apps Script
      },
      body: JSON.stringify({
        ...data,
        type: type,
        timestamp: new Date().toISOString(),
      }),
    });
    // With no-cors, response is opaque. We just assume success if no network error.
    return { success: true };
  } catch (error) {
    console.error('Google Sheets Error:', error);
    return { success: false, error };
  }
}

export async function fetchTestimonialsFromSheets() {
  try {
    if (googleSheetsUrl === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      return { success: false, data: [] };
    }
    const response = await fetch(googleSheetsUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    return { success: true, data: result.data || [] };
  } catch (error) {
    console.error('Fetch Testimonials Error:', error);
    return { success: false, data: [], error };
  }
}

export async function sendEmailNotification(formData) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return { success: true };
  } catch (error) {
    console.error('Email API Error:', error);
    return { success: false, error };
  }
}

export async function sendReviewEmail(formData) {
  try {
    const response = await fetch('/api/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to send review email');
    }

    return { success: true };
  } catch (error) {
    console.error('Review Email API Error:', error);
    return { success: false, error };
  }
}
