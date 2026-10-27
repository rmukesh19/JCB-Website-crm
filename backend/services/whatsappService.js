import axios from 'axios';

// Current credentials (using Production Phone Number ID)
const WHATSAPP_TOKEN = "EAAi8tYoZBlXwBSkdVGv4VPB11DQPPZCDjVBClVdM8OD1GAY2xyUxfzRyNWDh3Qz8hDgFbxdy0aPtUvWrlgoZC79ZCwUc2iVQ2U4zfBhKvwn2RsdJBmZCUGAXuZAOe52k84js4Ia7OcEEUeSSAMS6pZBOyZB76eqiZCkOYUOyQZA18n9NWmoP5welBycVv3KgCMZCqup7wZDZD";
const PHONE_NUMBER_ID = "1264885403385625";

export const triggerWhatsAppAutomation = async (companyId, templateType, data) => {
  try {
    const to = data.whatsAppNumber || data.mobileNumber || data.phone || data.mobile || '';
    if (!to) {
      console.log(`[WhatsApp API Service] Cannot send message, no valid number found for template: ${templateType}`);
      return { success: false, error: 'No phone number provided' };
    }

    // Clean number (remove non-digits, ensure starts with 91 for India)
    let cleanNumber = to.replace(/\D/g, '');
    if (cleanNumber.length === 10) {
      cleanNumber = `91${cleanNumber}`;
    }

    if (cleanNumber === '919626546679') {
      console.warn(`[WhatsApp API Service] Cannot send message: ${cleanNumber} is the sender business number (+91 96265 46679). Meta does not deliver messages to self.`);
      return { success: false, error: 'Recipient cannot be the sender business number' };
    }

    console.log(`[WhatsApp API Service] Sending ${templateType} template message to ${cleanNumber} (${data.customerName || 'Customer'})`);

    let templateName = '';
    let components = [];

    if (templateType === 'welcomemessage' || templateType === 'welcome' || templateType === 'customer_welcome_template') {
      templateName = 'customer_welcome_template';
      components = [
        {
          type: "header",
          parameters: [
            {
              type: "image",
              image: {
                link: "https://crm.mmtenterprises.in/mmt_whatsapp_promo_banner.jpg"
              }
            }
          ]
        },
        {
          type: "body",
          parameters: [
            { type: "text", parameter_name: "customer_name", text: data.customerName || "Customer" },
            { type: "text", parameter_name: "service_name", text: "JCB Rentals" },
            { type: "text", parameter_name: "phone_number", text: "+91 96265 46679" }
          ]
        }
      ];
    } else {
      console.log(`[WhatsApp API Service] Template type ${templateType} not configured yet.`);
      return { success: false, error: 'Template type not configured' };
    }

    const payload = {
      messaging_product: "whatsapp",
      to: cleanNumber,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: "en"
        },
        components: components
      }
    };

    const response = await axios.post(`https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`, payload, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`[WhatsApp API Service] Message sent successfully. Message ID:`, response.data.messages?.[0]?.id);
    return { success: true, messageId: response.data.messages?.[0]?.id || `WA_${Date.now()}` };
  } catch (error) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error('WhatsApp notification error:', errorMsg);
    return { success: false, error: errorMsg };
  }
};

export const sendWhatsAppMessage = async ({ to, text, imageUrl, customerName, sector }) => {
  let cleanNumber = '';
  try {
    if (!to) {
      return { success: false, error: 'Recipient phone number is required.' };
    }

    cleanNumber = String(to).replace(/\D/g, '');
    if (cleanNumber.length === 10) {
      cleanNumber = `91${cleanNumber}`;
    }

    if (cleanNumber === '919626546679') {
      return {
        success: false,
        error: 'Recipient cannot be the sender business number (+91 96265 46679).'
      };
    }

    const messageContent = (text || '').trim();

    // Determine header image (user-uploaded custom image or default MMT promotional banner)
    let headerImageUrl = 'https://crm.mmtenterprises.in/mmt_whatsapp_promo_banner.jpg';
    if (imageUrl) {
      headerImageUrl = imageUrl.startsWith('/') ? `https://crm.mmtenterprises.in${imageUrl}` : imageUrl;
    }

    // Meta template body has max length 1024 total. Truncate service_name parameter to ~750 characters to prevent #132005 error
    const serviceNameParam = messageContent ? (messageContent.length > 750 ? messageContent.slice(0, 750) : messageContent) : (sector ? `${sector} Machinery Services` : 'JCB Machinery & Services');

    const payload = {
      messaging_product: "whatsapp",
      to: cleanNumber,
      type: "template",
      template: {
        name: "customer_welcome_template",
        language: {
          code: "en"
        },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "image",
                image: {
                  link: headerImageUrl
                }
              }
            ]
          },
          {
            type: "body",
            parameters: [
              { type: "text", parameter_name: "customer_name", text: customerName || "Customer" },
              { type: "text", parameter_name: "service_name", text: serviceNameParam },
              { type: "text", parameter_name: "phone_number", text: "+91 96265 46679" }
            ]
          }
        ]
      }
    };

    console.log(`[WhatsApp API Service] Sending customer_welcome_template to ${cleanNumber} (${customerName || 'Customer'})...`);

    const response = await axios.post(`https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`, payload, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const msgInfo = response.data.messages?.[0];
    console.log(`[WhatsApp API Service] Template message successfully delivered to Meta for ${cleanNumber}:`, msgInfo);

    return {
      success: true,
      messageId: msgInfo?.id || `WA_${Date.now()}`
    };
  } catch (error) {
    const errorData = error.response?.data?.error;
    const errorMsg = errorData?.message || error.message;
    console.error(`[WhatsApp API Service] Send failed for ${cleanNumber}:`, errorData || error.message);

    return {
      success: false,
      error: errorMsg,
      code: errorData?.code,
      details: errorData
    };
  }
};

export const sendWhatsAppDirectText = async (to, text) => {
  return sendWhatsAppMessage({ to, text });
};

export default triggerWhatsAppAutomation;


