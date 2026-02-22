// Helper function to get date in readable format
const formatDisplayDate = (dateString: string): string => {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return dateString;
  }
};

// Get the last period start date from localStorage
export const getLastPeriodDate = (): string | null => {
  try {
    const savedDates = localStorage.getItem('periodStartDates');
    if (!savedDates) return null;
    
    const periodStartDates = JSON.parse(savedDates);
    if (periodStartDates.length === 0) return null;
    
    // Return the most recent period start date
    return periodStartDates[periodStartDates.length - 1];
  } catch {
    console.error('Error getting last period date');
    return null;
  }
};

// NEW: Get the last period end date from localStorage
export const getLastPeriodEndDate = (): string | null => {
  try {
    const savedEndDates = localStorage.getItem('periodEndDates');
    if (!savedEndDates) return null;
    
    const periodEndDates = JSON.parse(savedEndDates);
    if (periodEndDates.length === 0) return null;
    
    // Return the most recent period end date
    return periodEndDates[periodEndDates.length - 1];
  } catch {
    console.error('Error getting last period end date');
    return null;
  }
};

// Get formatted last period start display
export const getFormattedLastPeriod = (): string | null => {
  const lastPeriod = getLastPeriodDate();
  if (!lastPeriod) return null;
  return formatDisplayDate(lastPeriod);
};

// NEW: Get formatted last period end display
export const getFormattedLastPeriodEnd = (): string | null => {
  const lastPeriodEnd = getLastPeriodEndDate();
  if (!lastPeriodEnd) return null;
  return formatDisplayDate(lastPeriodEnd);
};

// Get days since last period (using end date for calculation)
export const getDaysSinceLastPeriod = (): number | null => {
  try {
    // Use end date for calculation
    const lastPeriodEnd = getLastPeriodEndDate();
    if (!lastPeriodEnd) return null;
    
    const [year, month, day] = lastPeriodEnd.split('-').map(Number);
    const lastPeriodDate = new Date(year, month - 1, day);
    const today = new Date();
    
    // Reset time to compare dates only
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const lastPeriodMidnight = new Date(lastPeriodDate.getFullYear(), lastPeriodDate.getMonth(), lastPeriodDate.getDate());
    
    const diffTime = todayMidnight.getTime() - lastPeriodMidnight.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch {
    console.error('Error calculating days since last period');
    return null;
  }
};