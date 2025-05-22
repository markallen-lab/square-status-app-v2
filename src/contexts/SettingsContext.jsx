
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as appSettingsService from '@/lib/appSettingsService';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const supportedCurrencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export const SettingsProvider = ({ children }) => {
  const [settings, setSettingsState] = useState(appSettingsService.getSettings());

  useEffect(() => {
    appSettingsService.saveSettings(settings);
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettingsState(prevSettings => ({ ...prevSettings, ...newSettings }));
  };
  
  const currency = supportedCurrencies.find(c => c.code === settings.currency) || supportedCurrencies[0];

  const value = {
    settings,
    updateSettings,
    currency,
    supportedCurrencies
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
