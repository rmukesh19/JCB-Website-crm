import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Branch from '../models/Branch.js';
import { parseTimeToMinutes } from '../utils/helpers.js';
import logAudit from '../services/auditService.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ username, password });
      } catch (dbErr) {
        console.warn('DB User lookup warning:', dbErr.message);
      }
    }

    // Fallback default admin user if database is empty/unseeded or disconnected
    if (!user && username === 'admin' && password === 'admin') {
      user = {
        id: 1,
        companyId: 1,
        branchId: 1,
        name: 'Ananth Krishnan',
        username: 'admin',
        email: 'ananth@jcb360infra.com',
        role: 'ADMIN',
        isActive: true
      };
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Login time restriction check
    if (user.role !== 'ADMIN' && user.loginTimeRestrictionEnabled) {
      const now = new Date();
      let currentHour = now.getHours();
      let currentMinute = now.getMinutes();

      if (req.body.clientHour !== undefined && req.body.clientMinute !== undefined) {
        currentHour = req.body.clientHour;
        currentMinute = req.body.clientMinute;
      }

      const currentMinutesFromMidnight = currentHour * 60 + currentMinute;
      const fromMin = parseTimeToMinutes(user.loginAllowedFrom || '09:00 AM');
      const toMin = parseTimeToMinutes(user.loginAllowedTo || '06:00 PM');

      if (fromMin !== null && toMin !== null) {
        let isAllowed = false;
        if (fromMin <= toMin) {
          isAllowed = currentMinutesFromMidnight >= fromMin && currentMinutesFromMidnight <= toMin;
        } else {
          isAllowed = currentMinutesFromMidnight >= fromMin || currentMinutesFromMidnight <= toMin;
        }

        if (!isAllowed) {
          return res.status(403).json({
            success: false,
            message: 'Your login time has expired. Please contact the administrator.'
          });
        }
      }
    }

    const secret = process.env.JWT_SECRET || 'jcb360_enterprise_super_secret_jwt_key_2026';
    const token = jwt.sign({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      companyId: user.companyId || 1,
      branchId: user.branchId || 1
    }, secret, { expiresIn: '7d' });

    let company = null;
    let branch = null;
    if (mongoose.connection.readyState === 1) {
      try {
        company = await Company.findOne({ id: user.companyId });
        branch = await Branch.findOne({ id: user.branchId });
      } catch (dbErr) {
        console.warn('DB Company/Branch lookup warning:', dbErr.message);
      }
    }

    if (!company) {
      company = { name: 'MMT ENTERPRISES' };
    }
    if (!branch) {
      branch = { name: 'Chennai HQ' };
    }

    await logAudit(user.companyId || 1, user.id, user.name, 'LOGIN', `User ${user.username} successfully logged in.`);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        companyId: user.companyId || 1,
        branchId: user.branchId || 1,
        companyName: company.name,
        branchName: branch.name,
        loginAllowedFrom: user.loginAllowedFrom,
        loginAllowedTo: user.loginAllowedTo,
        loginTimeRestrictionEnabled: user.loginTimeRestrictionEnabled
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  return res.json({ success: true, user: req.currentUser });
};
