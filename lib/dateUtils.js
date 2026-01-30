export const getISTDate = () => {
  // Create a date object for the current time
  const now = new Date();
  
  // Convert to IST (UTC+5:30)
  // We use the "en-CA" locale (YYYY-MM-DD) with the Asia/Kolkata timezone
  return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
  }).format(now);
};

export const getISTDateTime = () => {
    const now = new Date();
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(now);
};
