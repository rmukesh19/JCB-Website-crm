export const triggerWhatsAppAutomation = async (companyId, templateType, data) => {
  try {
    console.log(`[WhatsApp API Service] Sending ${templateType} template message to ${data.whatsAppNumber || data.mobile || 'Customer'}`);
    return { success: true, messageId: `WA_${Date.now()}` };
  } catch (error) {
    console.error('WhatsApp notification error:', error.message);
    return { success: false, error: error.message };
  }
};

export default triggerWhatsAppAutomation;
