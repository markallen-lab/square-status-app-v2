
import * as storageService from './storageService';

const APP_SETTINGS_KEY = 'appSettings_v1';

const defaultSettings = {
  enableRoleSelectionOnSignup: true,
  currency: 'USD', // Default currency
  darkMode: false, // Default theme
  notificationsEnabled: true,
};

export const getSettings = () => {
  const storedSettings = storageService.getItem(APP_SETTINGS_KEY);
  const mergedSettings = storedSettings ? { ...defaultSettings, ...storedSettings } : defaultSettings;
  
  // Ensure currency is a valid one, otherwise default to USD
  const validCurrencies = ['USD', 'EUR', 'GBP', 'ZAR', 'AUD', 'CAD', 'JPY'];
  if (!validCurrencies.includes(mergedSettings.currency)) {
    mergedSettings.currency = 'USD';
  }
  
  return mergedSettings;
};

export const saveSettings = (newSettings) => {
  const currentSettings = getSettings();
  const updatedSettings = { ...currentSettings, ...newSettings };
  storageService.setItem(APP_SETTINGS_KEY, updatedSettings);
  return updatedSettings;
};
