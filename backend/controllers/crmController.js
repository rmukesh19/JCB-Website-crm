import Lead from '../models/Lead.js';
import Customer from '../models/Customer.js';
import logAudit from '../services/auditService.js';
import triggerWhatsAppAutomation from '../services/whatsappService.js';
import { isDbConnected, memoryStore } from '../services/memoryStore.js';

export const getLeads = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const leads = await Lead.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(leads);
      } catch (dbErr) {
        console.warn('getLeads DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createLead = async (req, res) => {
  try {
    let newLead = null;
    const custType = req.body.customerType || req.body.businessType || 'Contractor';

    if (isDbConnected()) {
      try {
        const count = await Lead.countDocuments();
        const id = count + 1;
        newLead = new Lead({
          id,
          companyId: req.currentUser?.companyId || 1,
          customerName: req.body.customerName || '',
          companyName: req.body.companyName || '',
          mobileNumber: req.body.mobileNumber || '',
          whatsAppNumber: req.body.whatsAppNumber || '',
          email: req.body.email || '',
          address: req.body.address || '',
          district: req.body.district || '',
          businessType: custType,
          customerType: custType,
          interestedMachine: req.body.interestedMachine || '',
          rentalRequirement: req.body.rentalRequirement || '',
          leadSource: req.body.leadSource || 'Website',
          marketingExecutive: req.body.marketingExecutive || req.currentUser?.name,
          priority: req.body.priority || 'MEDIUM',
          expectedBookingDate: req.body.expectedBookingDate || '',
          remarks: req.body.remarks || '',
          status: req.body.status || 'NEW',
          followUps: req.body.followUps || [],
          quotations: req.body.quotations || []
        });
        await newLead.save();
      } catch (dbErr) {
        console.warn('createLead DB fallback:', dbErr.message);
      }
    }

    if (!newLead) {
      const id = memoryStore.leads.length + 1;
      newLead = {
        id,
        companyId: req.currentUser?.companyId || 1,
        customerName: req.body.customerName || '',
        companyName: req.body.companyName || '',
        mobileNumber: req.body.mobileNumber || '',
        whatsAppNumber: req.body.whatsAppNumber || '',
        email: req.body.email || '',
        address: req.body.address || '',
        district: req.body.district || '',
        businessType: custType,
        customerType: custType,
        interestedMachine: req.body.interestedMachine || '',
        rentalRequirement: req.body.rentalRequirement || '',
        leadSource: req.body.leadSource || 'Website',
        marketingExecutive: req.body.marketingExecutive || req.currentUser?.name,
        priority: req.body.priority || 'MEDIUM',
        expectedBookingDate: req.body.expectedBookingDate || '',
        remarks: req.body.remarks || '',
        status: req.body.status || 'NEW',
        followUps: req.body.followUps || [],
        quotations: req.body.quotations || []
      };
      memoryStore.leads.push(newLead);
    }

    await triggerWhatsAppAutomation(req.currentUser?.companyId, 'Welcome', newLead);
    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'CREATE_LEAD', `Created CRM lead ID ${newLead.id} for ${newLead.customerName}`);
    return res.json(newLead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let updated = null;
    if (isDbConnected()) {
      try {
        updated = await Lead.findOneAndUpdate({ id }, req.body, { new: true });
      } catch (dbErr) {
        console.warn('updateLead DB fallback:', dbErr.message);
      }
    }

    if (!updated) {
      const idx = memoryStore.leads.findIndex(l => l.id === id);
      if (idx !== -1) {
        memoryStore.leads[idx] = { ...memoryStore.leads[idx], ...req.body };
        updated = memoryStore.leads[idx];
      }
    }

    if (!updated) return res.status(404).json({ error: 'Lead not found' });
    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'UPDATE_LEAD', `Updated CRM lead ID ${id}`);
    return res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const convertLeadToCustomer = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let lead = null;
    let customer = null;

    if (isDbConnected()) {
      try {
        lead = await Lead.findOne({ id });
        if (lead) {
          customer = await Customer.findOne({ mobile: lead.mobileNumber });
          if (!customer) {
            const count = await Customer.countDocuments();
            const customerId = count + 1;
            customer = new Customer({
              id: customerId,
              companyId: req.currentUser?.companyId || 1,
              name: lead.customerName,
              companyName: lead.companyName || lead.customerName,
              mobile: lead.mobileNumber,
              whatsApp: lead.whatsAppNumber || lead.mobileNumber,
              email: lead.email,
              address: lead.address || lead.district || '',
              outstandingBalance: 0,
              creditLimit: 100000,
              status: 'ACTIVE'
            });
            await customer.save();
          }
          lead.status = 'CONVERTED';
          await lead.save();
        }
      } catch (dbErr) {
        console.warn('convertLeadToCustomer DB fallback:', dbErr.message);
      }
    }

    if (!lead) {
      const idx = memoryStore.leads.findIndex(l => l.id === id);
      if (idx !== -1) {
        lead = memoryStore.leads[idx];
        lead.status = 'CONVERTED';

        customer = memoryStore.customers.find(c => c.mobile === lead.mobileNumber);
        if (!customer) {
          customer = {
            id: memoryStore.customers.length + 1,
            companyId: req.currentUser?.companyId || 1,
            name: lead.customerName,
            companyName: lead.companyName || lead.customerName,
            mobile: lead.mobileNumber,
            whatsApp: lead.whatsAppNumber || lead.mobileNumber,
            email: lead.email,
            address: lead.address || lead.district || '',
            outstandingBalance: 0,
            creditLimit: 100000,
            status: 'ACTIVE'
          };
          memoryStore.customers.push(customer);
        }
      }
    }

    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'CONVERT_LEAD', `Converted lead ${lead.customerName} into customer account`);
    return res.json({ success: true, customer, lead });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
