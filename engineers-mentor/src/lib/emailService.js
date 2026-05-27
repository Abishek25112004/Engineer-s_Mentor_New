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
    const emailjs = (await import('@emailjs/browser')).default;
    
    // Send notification to business owner
    await emailjs.send(
      emailConfig.serviceId,
      emailConfig.templateId,
      {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        college: formData.college,
        department: formData.department,
        domain: formData.domain,
        message: formData.description,
        to_email: 'engineersmentorservices@gmail.com',
      },
      emailConfig.publicKey
    );

    // Send confirmation to client
    await emailjs.send(
      emailConfig.serviceId,
      emailConfig.confirmationTemplateId,
      {
        to_name: formData.name,
        to_email: formData.email,
        domain: formData.domain,
      },
      emailConfig.publicKey
    );

    return { success: true };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { success: false, error };
  }
}
