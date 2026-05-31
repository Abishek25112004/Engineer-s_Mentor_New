export const emailConfig = {
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
  confirmationTemplateId: 'YOUR_CONFIRMATION_TEMPLATE_ID',
  publicKey: 'YOUR_PUBLIC_KEY',
};

export const googleSheetsUrl = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

export async function submitToGoogleSheets(formData) {
  try {
    const response = await fetch(googleSheetsUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString(),
      }),
    });
    return { success: true };
  } catch (error) {
    console.error('Google Sheets Error:', error);
    return { success: false, error };
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
