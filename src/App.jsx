
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Pages
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import VerifyEmail from '@/pages/VerifyEmail';
import VerifyPhone from '@/pages/VerifyPhone';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';
import Clients from '@/pages/Clients';
import Leads from '@/pages/Leads';
import Tasks from '@/pages/Tasks';
import Projects from '@/pages/Projects';
import Collections from '@/pages/Collections';
import MeetingsPage from '@/pages/MeetingsPage';
import Profile from '@/pages/Profile';
import SettingsPage from '@/pages/SettingsPage';
import UserAccounts from '@/pages/Users/UserAccounts';
import UserStatus from '@/pages/Users/UserStatus';
import SignupSettings from '@/pages/Security/SignupSettings';
import MarketingCampaigns from '@/pages/Marketing/Campaigns';
import MarketingEmail from '@/pages/Marketing/Email';
import MarketingSocial from '@/pages/Marketing/Social';
import HostingDomains from '@/pages/Hosting/Domains';
import HostingPackagesList from '@/pages/Hosting/PackagesList';
import PackageDetail from '@/pages/Hosting/PackageDetail';


// Layout
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { DataProvider } from '@/contexts/DataContext';
import { SettingsProvider } from '@/contexts/SettingsContext';

const ProtectedRoute = ({ children, adminOnly = false, superAdminOnly = false }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (superAdminOnly && currentUser.role !== 'super-admin') {
     return <Navigate to="/dashboard" replace />; 
  }
  
  if (adminOnly && !['admin', 'super-admin'].includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />; 
  }
  
  return children;
};

const App = () => {
  return (
    <SettingsProvider>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-phone" element={<VerifyPhone />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout><Dashboard /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/clients" 
            element={
              <ProtectedRoute>
                <DashboardLayout><Clients /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leads" 
            element={
              <ProtectedRoute>
                <DashboardLayout><Leads /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <DashboardLayout><Tasks /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <ProtectedRoute>
                <DashboardLayout><Projects /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/collections" 
            element={
              <ProtectedRoute>
                <DashboardLayout><Collections /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/meetings" 
            element={
              <ProtectedRoute>
                <DashboardLayout><MeetingsPage /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hosting" 
            element={<Navigate to="/hosting/domains" replace />} 
          />
          <Route 
            path="/hosting/domains" 
            element={
              <ProtectedRoute>
                <DashboardLayout><HostingDomains /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hosting/packages" 
            element={
              <ProtectedRoute>
                <DashboardLayout><HostingPackagesList /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hosting/packages/:packageId" 
            element={
              <ProtectedRoute>
                <DashboardLayout><PackageDetail /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <DashboardLayout><Profile /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <DashboardLayout><SettingsPage /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/accounts" 
            element={
              <ProtectedRoute superAdminOnly={true}>
                <DashboardLayout><UserAccounts /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/status" 
            element={
              <ProtectedRoute superAdminOnly={true}>
                <DashboardLayout><UserStatus /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/security/signup-settings" 
            element={
              <ProtectedRoute superAdminOnly={true}>
                <DashboardLayout><SignupSettings /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/marketing/campaigns" 
            element={
              <ProtectedRoute>
                <DashboardLayout><MarketingCampaigns /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/marketing/email" 
            element={
              <ProtectedRoute>
                <DashboardLayout><MarketingEmail /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/marketing/social" 
            element={
              <ProtectedRoute>
                <DashboardLayout><MarketingSocial /></DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DataProvider>
    </SettingsProvider>
  );
};

export default App;
