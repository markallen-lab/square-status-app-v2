
import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const CLIENTS_STORAGE_KEY = 'clients_data_v2';
const DOMAINS_STORAGE_KEY = 'hostingDomains_v2';
const PACKAGES_STORAGE_KEY = 'hostingPackages_v2';
const TASKS_STORAGE_KEY = 'tasks_v2';
const EXPENSES_STORAGE_KEY = 'expenses_v1';
const MEETINGS_STORAGE_KEY = 'meetings_v1';


const initialSampleClients = [
  { id: 'client_1', name: 'Tech Solutions Inc.', companyName: 'Tech Solutions Incorporated', email: 'contact@techsolutions.com', phone: '555-0101', status: 'Active', projects: 3, joined: '2023-01-15', domainId: 'domain_1', packageId: 'pkg1', taskIds: ['task_1'] },
  { id: 'client_2', name: 'Innovate Hub', companyName: 'Innovate Hub LLC', email: 'hello@innovatehub.io', phone: '555-0102', status: 'Active', projects: 5, joined: '2022-11-20', domainId: 'domain_2', packageId: 'pkg2', taskIds: [] },
];

const initialSampleDomains = [
  { id: 'domain_1', clientName: 'Tech Solutions Inc.', domainName: 'techsolutions.com', purchaseDate: '2023-01-15', renewalDate: '2025-01-15', status: 'Active', registrar: 'GoDaddy', clientId: 'client_1' },
  { id: 'domain_2', clientName: 'Innovate Hub', domainName: 'innovatehub.io', purchaseDate: '2022-06-20', renewalDate: '2024-06-20', status: 'Expires Soon', registrar: 'Namecheap', clientId: 'client_2' },
  { id: 'domain_3', clientName: 'Unassigned Services', domainName: 'example.com', purchaseDate: '2023-11-01', renewalDate: '2024-11-01', status: 'Active', registrar: 'Cloudflare', clientId: null },
];

const initialSamplePackages = [
  { id: 'pkg1', name: 'Basic Shared Hosting', price: 5.99, storage: '10GB SSD', bandwidth: '100GB', websites: 1, emailAccounts: 5, features: ['Free SSL', 'cPanel', 'Daily Backups'], hostingType: 'Shared', targetAudience: 'Personal Blogs' },
  { id: 'pkg2', name: 'Pro VPS Hosting', price: 29.99, storage: '100GB NVMe', bandwidth: '1TB', websites: 10, emailAccounts: 'Unlimited', features: ['Dedicated IP', 'Root Access', 'Scalable RAM'], hostingType: 'VPS', targetAudience: 'Developers & SMBs' },
];

const initialSampleTasks = [
  { id: 'task_1', title: 'Onboard Tech Solutions Inc.', project: 'Client Onboarding', assignedTo: 'Admin', priority: 'High', status: 'Pending', dueDate: '2023-09-15', timeTracked: 0, timerRunning: false, clientId: 'client_1' },
  { id: uuidv4(), title: 'Develop API endpoints for Mobile App', project: 'Mobile App Backend', assignedTo: 'Bob Developer', priority: 'Medium', status: 'In Progress', dueDate: '2025-09-20', timeTracked: 3600, timerRunning: false, clientId: null },
];

const initialSampleExpenses = [
    { id: `exp_${uuidv4()}`, description: 'Monthly Figma Subscription', amount: 15.00, date: '2025-05-01', category: 'Software' },
    { id: `exp_${uuidv4()}`, description: 'Google Ads Campaign', amount: 250.00, date: '2025-05-05', category: 'Marketing' },
    { id: `exp_${uuidv4()}`, description: 'Office Coffee Supplies', amount: 45.50, date: '2025-05-03', category: 'Office Supplies' },
];

const initialSampleMeetings = [
  { id: `meet_${uuidv4()}`, title: 'Project Kickoff with Tech Solutions', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '10:00', participants: 'John Doe, Jane Smith', description: 'Initial project discussion and planning for Tech Solutions account.', clientIds: ['client_1'] },
  { id: `meet_${uuidv4()}`, title: 'Weekly Team Sync', date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '14:30', participants: 'Internal Team', description: 'Regular team update meeting.', clientIds: [] },
];


const getStoredData = (key, fallback) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length >= 0 ? parsed : fallback; 
    } catch (error) {
      console.error(`Failed to parse ${key} from localStorage`, error);
      localStorage.setItem(key, JSON.stringify(fallback)); 
      return fallback;
    }
  }
  localStorage.setItem(key, JSON.stringify(fallback)); 
  return fallback;
};

const storeData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};


export const DataProvider = ({ children }) => {
  const [clients, setClientsState] = useState(() => getStoredData(CLIENTS_STORAGE_KEY, initialSampleClients));
  const [domains, setDomainsState] = useState(() => getStoredData(DOMAINS_STORAGE_KEY, initialSampleDomains));
  const [packages, setPackagesState] = useState(() => getStoredData(PACKAGES_STORAGE_KEY, initialSamplePackages));
  const [tasks, setTasksState] = useState(() => getStoredData(TASKS_STORAGE_KEY, initialSampleTasks));
  const [expenses, setExpensesState] = useState(() => getStoredData(EXPENSES_STORAGE_KEY, initialSampleExpenses));
  const [meetings, setMeetingsState] = useState(() => getStoredData(MEETINGS_STORAGE_KEY, initialSampleMeetings));


  const setClients = (data) => {
    const newData = typeof data === 'function' ? data(clients) : data;
    setClientsState(newData);
    storeData(CLIENTS_STORAGE_KEY, newData);
  };

  const setDomains = (data) => {
    const newData = typeof data === 'function' ? data(domains) : data;
    setDomainsState(newData);
    storeData(DOMAINS_STORAGE_KEY, newData);
  };

  const setPackages = (data) => {
    const newData = typeof data === 'function' ? data(packages) : data;
    setPackagesState(newData);
    storeData(PACKAGES_STORAGE_KEY, newData);
  };

  const setTasks = (data) => {
    const newData = typeof data === 'function' ? data(tasks) : data;
    setTasksState(newData);
    storeData(TASKS_STORAGE_KEY, newData);
  };

  const setExpenses = (data) => {
    const newData = typeof data === 'function' ? data(expenses) : data;
    setExpensesState(newData);
    storeData(EXPENSES_STORAGE_KEY, newData);
  };

  const setMeetings = (data) => {
    const newData = typeof data === 'function' ? data(meetings) : data;
    setMeetingsState(newData);
    storeData(MEETINGS_STORAGE_KEY, newData);
  };
  
  useEffect(() => {
    if (localStorage.getItem(CLIENTS_STORAGE_KEY) === null) storeData(CLIENTS_STORAGE_KEY, initialSampleClients);
    if (localStorage.getItem(DOMAINS_STORAGE_KEY) === null) storeData(DOMAINS_STORAGE_KEY, initialSampleDomains);
    if (localStorage.getItem(PACKAGES_STORAGE_KEY) === null) storeData(PACKAGES_STORAGE_KEY, initialSamplePackages);
    if (localStorage.getItem(TASKS_STORAGE_KEY) === null) storeData(TASKS_STORAGE_KEY, initialSampleTasks);
    if (localStorage.getItem(EXPENSES_STORAGE_KEY) === null) storeData(EXPENSES_STORAGE_KEY, initialSampleExpenses);
    if (localStorage.getItem(MEETINGS_STORAGE_KEY) === null) storeData(MEETINGS_STORAGE_KEY, initialSampleMeetings);
  }, []);


  const value = {
    clients,
    setClients,
    domains,
    setDomains,
    packages,
    setPackages,
    tasks,
    setTasks,
    expenses,
    setExpenses,
    meetings,
    setMeetings,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
