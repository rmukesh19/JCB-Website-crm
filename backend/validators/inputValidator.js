export const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required.' });
  }
  next();
};

export const validateMachine = (req, res, next) => {
  const { plateNumber } = req.body;
  if (!plateNumber) {
    return res.status(400).json({ success: false, error: 'Machine registration/plate number is required.' });
  }
  next();
};

export const validateCustomer = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Customer name is required.' });
  }
  next();
};
