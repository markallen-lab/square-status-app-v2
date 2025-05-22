
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import * as authService from '@/lib/authService';
import * as userManagementService from '@/lib/userManagementService';
import * as appSettingsService from '@/lib/appSettingsService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appSettings, setAppSettings] = useState(appSettingsService.getSettings());
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = authService.getCurrentUserFromStorage();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const updateAppSettings = useCallback((newSettings) => {
    const updatedSettings = appSettingsService.saveSettings(newSettings);
    setAppSettings(updatedSettings);
    toast({ title: "Settings Updated", description: "Application settings have been saved." });
  }, [toast]);

  const signup = useCallback(async (email, password, name, phone, role) => {
    try {
      const newUser = await authService.registerUser(email, password, name, phone, role, appSettings.enableRoleSelectionOnSignup);
      const emailCode = authService.generateVerificationCode();
      const phoneCode = authService.generateVerificationCode();
      authService.setVerificationCode('email', email, emailCode);
      authService.setVerificationCode('phone', phone, phoneCode);
      
      const { password: _, ...userToReturn } = newUser;
      return userToReturn;
    } catch (error) {
      toast({ variant: "destructive", title: "Signup Failed", description: error.message });
      throw error;
    }
  }, [toast, appSettings.enableRoleSelectionOnSignup]);

  const login = useCallback(async (email, password) => {
    try {
      const user = await authService.authenticateUser(email, password);

      if (!user.emailVerified) {
        const emailCode = authService.generateVerificationCode();
        authService.setVerificationCode('email', email, emailCode);
        toast({ title: "Email Verification Required", description: "Please verify your email." });
        navigate('/verify-email', { state: { email } });
        return;
      }
      if (!user.phoneVerified) {
        const phoneCode = authService.generateVerificationCode();
        authService.setVerificationCode('phone', user.phone, phoneCode);
        toast({ title: "Phone Verification Required", description: "Please verify your phone." });
        navigate('/verify-phone', { state: { phone: user.phone, email: user.email } });
        return;
      }
      
      const { password: _, ...userToLogin } = user;
      authService.saveCurrentUserToStorage(userToLogin);
      setCurrentUser(userToLogin);
      toast({ title: "Login Successful", description: `Welcome back, ${user.name}!` });
      return userToLogin;
    } catch (error) {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
      throw error;
    }
  }, [toast, navigate]);

  const verifyEmail = useCallback(async (email, code) => {
    try {
      const result = await authService.confirmEmailVerification(email, code);
      toast({ title: "Email Verified", description: "Your email has been successfully verified." });
      return result;
    } catch (error) {
      toast({ variant: "destructive", title: "Verification Failed", description: error.message });
      throw error;
    }
  }, [toast]);

  const verifyPhone = useCallback(async (phone, code, email) => {
    try {
      const result = await authService.confirmPhoneVerification(phone, code, email);
      if (result.loggedInUser) {
        setCurrentUser(result.loggedInUser);
      }
      toast({ title: "Phone Verified", description: "Your phone number has been successfully verified." });
      return { verified: true };
    } catch (error) {
      toast({ variant: "destructive", title: "Verification Failed", description: error.message });
      throw error;
    }
  }, [toast]);

  const logout = useCallback(() => {
    authService.removeCurrentUserFromStorage();
    setCurrentUser(null);
    navigate('/login');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  }, [navigate, toast]);

  const updateUserProfile = useCallback(async (profileData) => {
    if (!currentUser) throw new Error("No user logged in");
    try {
      const updatedUser = await userManagementService.updateUserProfile(currentUser.id, profileData);
      setCurrentUser(updatedUser);
      toast({ title: "Profile Updated", description: "Your profile information has been saved." });
      return updatedUser;
    } catch (error) {
      toast({ variant: "destructive", title: "Profile Update Failed", description: error.message });
      throw error;
    }
  }, [currentUser, toast]);

  const changeUserPassword = useCallback(async (newPassword) => {
    if (!currentUser) throw new Error("No user logged in");
    try {
      await userManagementService.changeUserPassword(currentUser.id, newPassword);
      toast({ title: "Password Changed", description: "Your password has been updated successfully." });
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Password Change Failed", description: error.message });
      throw error;
    }
  }, [currentUser, toast]);

  const requestPasswordReset = useCallback(async (email) => {
    try {
      await authService.initiatePasswordReset(email);
      toast({ title: "Password Reset Email Sent", description: `If an account exists for ${email}, a password reset link has been sent.` });
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Password Reset Failed", description: error.message });
      throw error;
    }
  }, [toast]);

  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      await authService.completePasswordReset(token, newPassword);
      toast({ title: "Password Reset Successful", description: "Your password has been reset. Please log in." });
      return true;
    } catch (error) {
      toast({ variant: "destructive", title: "Password Reset Failed", description: error.message });
      throw error;
    }
  }, [toast]);

  const getAllUsers = useCallback(() => {
    if (currentUser?.role !== 'super-admin') {
      toast({ variant: "destructive", title: "Access Denied", description: "You do not have permission to view all users." });
      return [];
    }
    return userManagementService.getAllUsers();
  }, [currentUser, toast]);

  const updateUserAccountStatus = useCallback(async (userId, updates) => {
    if (currentUser?.role !== 'super-admin') {
      toast({ variant: "destructive", title: "Access Denied", description: "You do not have permission to update users." });
      return null;
    }
    try {
      const updatedUser = await userManagementService.updateUserStatus(userId, updates, currentUser.id);
      if (currentUser.id === userId) { // If super-admin updates their own role/status
         setCurrentUser(updatedUser);
      }
      toast({ title: "User Update Successful", description: "User account has been updated." });
      return updatedUser;
    } catch (error) {
      toast({ variant: "destructive", title: "User Update Failed", description: error.message });
      throw error;
    }
  }, [currentUser, toast]);


  const value = {
    currentUser,
    loading,
    appSettings,
    updateAppSettings,
    signup,
    login,
    logout,
    verifyEmail,
    verifyPhone,
    updateUserProfile,
    changeUserPassword,
    requestPasswordReset,
    resetPassword,
    getAllUsers,
    updateUserAccountStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
