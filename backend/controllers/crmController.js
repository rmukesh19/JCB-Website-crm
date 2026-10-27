import CrmLead from '../models/CrmLead.js';
import Customer from '../models/Customer.js';
import { triggerWhatsAppAutomation } from '../services/whatsappService.js';

const getNextId = async (Model) => {
  const last = await Model.findOne().sort({ id: -1 }).select('id');
  return (last && typeof last.id === 'number') ? last.id + 1 : 1;
};

const findLeadById = (id) => {
  if (id && String(id).length === 24) {
    return CrmLead.findOne({ $or: [{ _id: id }, { id: Number(id) || -1 }] });
  }
  const num = Number(id);
  if (!isNaN(num)) {
    return CrmLead.findOne({ $or: [{ id: num }, { _id: id }] });
  }
  return CrmLead.findOne({ _id: id });
};

export const getLeads = async (req, res) => {
  try {
    const leads = await CrmLead.find().sort({ id: -1, createdAt: -1 });
    res.json(leads);
  } catch (err) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Failed to fetch leads', details: err.message });
  }
};

export const normalizePhone = (phone) => {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

export const normalizeText = (text) => String(text || '').trim().toLowerCase();

export const createLead = async (req, res) => {
  try {
    const customerType = req.body.customerType || req.body.businessType || 'Contractor';
    const customerName = (req.body.customerName || req.body.name || '').trim();
    const mobileNumber = (req.body.mobileNumber || req.body.phone || '').trim();

    if (!customerName || !mobileNumber) {
      return res.status(400).json({ error: 'Customer Name and Mobile Number are required.' });
    }

    // --- SENDER NUMBER CHECK ---
    const targetPhone = normalizePhone(mobileNumber);
    if (targetPhone === '9626546679') {
      return res.status(400).json({
        error: 'Cannot use +91 96265 46679: This is your own WhatsApp Business sender number. Meta cannot deliver a WhatsApp message to itself. Please enter the customer/recipient mobile number (e.g. 7418831620).'
      });
    }

    // --- DUPLICATE DATA VALIDATION ---
    const targetName = normalizeText(customerName);
    const targetCompany = normalizeText(req.body.companyName);

    const existingLeads = await CrmLead.find();
    const duplicate = existingLeads.find(l => {
      const lPhone = normalizePhone(l.mobileNumber || l.phone || l.whatsAppNumber);
      const lName = normalizeText(l.customerName || l.name);
      const lCompany = normalizeText(l.companyName);

      // Check duplicate by phone number (exact 10 digits match)
      if (targetPhone && lPhone && targetPhone === lPhone) {
        return true;
      }
      // Check duplicate by matching Name and Company / Phone
      if (targetName && lName && targetName === lName) {
        if (targetCompany && lCompany && targetCompany === lCompany) {
          return true;
        }
      }
      return false;
    });

    if (duplicate) {
      const dupName = duplicate.customerName || duplicate.name || 'Existing Lead';
      const dupPhone = duplicate.mobileNumber || duplicate.phone || mobileNumber;
      return res.status(400).json({
        error: `Duplicate Entry! A lead with mobile number "${dupPhone}" already exists for ${dupName} (Status: ${duplicate.status || 'Active'}). Duplicate records are not allowed.`,
        duplicate: true,
        existingLeadId: duplicate.id || duplicate._id
      });
    }

    const nextId = await getNextId(CrmLead);
    const leadData = {
      ...req.body,
      id: nextId,
      companyId: req.body.companyId || req.currentUser?.companyId || 1,
      customerName,
      name: req.body.name || customerName,
      customerType,
      mobileNumber,
      phone: req.body.phone || mobileNumber,
      status: req.body.status || 'NEW',
      priority: req.body.priority || 'MEDIUM',
      followUps: req.body.followUps || [],
      quotations: req.body.quotations || [],
      nextFollowUpDate: req.body.nextFollowUpDate || '',
      nextFollowUpTime: req.body.nextFollowUpTime || ''
    };

    const newLead = await CrmLead.create(leadData);

    // Trigger WhatsApp notification for new lead
    // Send without await so it doesn't block the API response
    triggerWhatsAppAutomation(leadData.companyId, 'welcomemessage', leadData);

    res.status(201).json(newLead);
  } catch (err) {
    console.error('Error creating lead:', err);
    res.status(500).json({ error: 'Failed to create lead', details: err.message });
  }
};

export const importLeads = async (req, res) => {
  try {
    const list = Array.isArray(req.body) ? req.body : (req.body.leads || req.body.data || []);
    if (!Array.isArray(list) || list.length === 0) {
      return res.status(400).json({ error: 'No lead records provided for import' });
    }

    const existingLeads = await CrmLead.find();
    const existingPhones = new Set();
    const existingNameKeys = new Set();

    existingLeads.forEach(l => {
      const p = normalizePhone(l.mobileNumber || l.phone || l.whatsAppNumber);
      if (p) existingPhones.add(p);
      const n = normalizeText(l.customerName || l.name);
      const c = normalizeText(l.companyName);
      if (n) existingNameKeys.add(`${n}:::${c}`);
    });

    let startId = await getNextId(CrmLead);
    const docsToInsert = [];
    let skippedDuplicates = 0;

    for (let index = 0; index < list.length; index++) {
      const l = list[index];
      const customerName = (l.customerName || l.name || `Imported Lead ${index + 1}`).trim();
      const mobileNumber = (l.mobileNumber || l.phone || l.whatsAppNumber || '').trim();
      const p = normalizePhone(mobileNumber);
      const nKey = `${normalizeText(customerName)}:::${normalizeText(l.companyName)}`;

      // Filter out duplicate rows
      if ((p && existingPhones.has(p)) || existingNameKeys.has(nKey)) {
        skippedDuplicates++;
        continue;
      }

      if (p) existingPhones.add(p);
      existingNameKeys.add(nKey);

      docsToInsert.push({
        ...l,
        id: startId + docsToInsert.length,
        companyId: req.body.companyId || req.currentUser?.companyId || 1,
        customerName,
        name: l.name || customerName,
        customerType: l.customerType || l.businessType || 'Contractor',
        businessType: l.businessType || l.customerType || 'Contractor',
        companyName: l.companyName || '',
        mobileNumber,
        phone: l.phone || mobileNumber,
        whatsAppNumber: l.whatsAppNumber || mobileNumber,
        email: l.email || '',
        district: l.district || l.city || '',
        area: l.area || '',
        address: l.address || '',
        interestedMachine: l.interestedMachine || l.machine || 'JCB 3DX Super',
        rentalRequirement: l.rentalRequirement || l.requirement || 'Hourly',
        budget: l.budget || l.estimatedValue || '',
        leadSource: l.leadSource || l.source || 'CSV Import',
        priority: (l.priority || 'MEDIUM').toUpperCase(),
        status: l.status || 'NEW',
        followUps: l.followUps || [],
        quotations: l.quotations || [],
        nextFollowUpDate: l.nextFollowUpDate || '',
        nextFollowUpTime: l.nextFollowUpTime || ''
      });
    }

    let createdDocs = [];
    if (docsToInsert.length > 0) {
      createdDocs = await CrmLead.create(docsToInsert);
    }

    res.json({
      success: true,
      count: docsToInsert.length,
      skippedDuplicates,
      message: `Imported ${docsToInsert.length} leads successfully. ${skippedDuplicates > 0 ? `(${skippedDuplicates} duplicate records skipped)` : ''}`,
      leads: Array.isArray(createdDocs) ? createdDocs : [createdDocs]
    });
  } catch (err) {
    console.error('Error importing leads:', err);
    res.status(500).json({ error: 'Failed to import leads', details: err.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const lead = await findLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const newMobile = req.body.mobileNumber || req.body.phone;
    if (newMobile) {
      const targetPhone = normalizePhone(newMobile);
      const targetId = String(lead.id || lead._id);

      const existingLeads = await CrmLead.find();
      const duplicate = existingLeads.find(l => {
        const lId = String(l.id || l._id);
        if (lId === targetId) return false;
        const lPhone = normalizePhone(l.mobileNumber || l.phone || l.whatsAppNumber);
        return targetPhone && lPhone && targetPhone === lPhone;
      });

      if (duplicate) {
        return res.status(400).json({
          error: `Duplicate Entry! Another lead already exists with mobile number "${newMobile}" (${duplicate.customerName || duplicate.name}).`,
          duplicate: true
        });
      }
    }

    Object.assign(lead, req.body);
    await lead.save();

    res.json(lead);
  } catch (err) {
    console.error('Error updating lead:', err);
    res.status(500).json({ error: 'Failed to update lead', details: err.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const lead = await findLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    await CrmLead.deleteOne({ _id: lead._id });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    console.error('Error deleting lead:', err);
    res.status(500).json({ error: 'Failed to delete lead', details: err.message });
  }
};

export const convertLeadToCustomer = async (req, res) => {
  try {
    const lead = await findLeadById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const custId = await getNextId(Customer);
    const customer = await Customer.create({
      id: custId,
      companyId: lead.companyId || 1,
      name: lead.customerName || lead.name,
      company: lead.companyName || '',
      customerType: lead.customerType || 'Individual / Home Owner',
      contactPerson: lead.contactPerson || lead.customerName || lead.name,
      mobile: lead.mobileNumber || lead.phone || '',
      phone: lead.phone || lead.mobileNumber || '',
      email: lead.email || '',
      billingAddress: lead.address || lead.location || lead.area || '',
      currentBalance: 0,
      outstanding: 0,
      status: 'ACTIVE'
    });

    lead.status = 'CONVERTED';
    await lead.save();

    res.json({ success: true, customerId: customer.id, customer });
  } catch (err) {
    console.error('Error converting lead to customer:', err);
    res.status(500).json({ error: 'Failed to convert lead', details: err.message });
  }
};

export const clearAllLeads = async (req, res) => {
  try {
    const deleted = await CrmLead.deleteMany({});
    res.json({ success: true, message: 'All CRM leads and enquiries cleared successfully.', count: deleted?.deletedCount || 0 });
  } catch (err) {
    console.error('Error clearing leads:', err);
    res.status(500).json({ error: 'Failed to clear leads', details: err.message });
  }
};

