export const generateInvoiceNumber = (sequenceId) => {
  const year = new Date().getFullYear();
  const seq = String(sequenceId).padStart(4, '0');
  return `INV-${year}-${seq}`;
};

export const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  timeStr = timeStr.trim().toUpperCase();
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)?$/);
  if (!match) {
    const match2 = timeStr.match(/^(\d+):(\d+)$/);
    if (!match2) return null;
    return parseInt(match2[1], 10) * 60 + parseInt(match2[2], 10);
  }
  let hr = parseInt(match[1], 10);
  const min = parseInt(match[2], 10);
  const ampm = match[3];
  if (ampm === 'PM' && hr < 12) hr += 12;
  if (ampm === 'AM' && hr === 12) hr = 0;
  return hr * 60 + min;
};
