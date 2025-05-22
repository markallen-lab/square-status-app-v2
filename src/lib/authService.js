
import * as storageService from './storageService';

const USERS_STORAGE_KEY = 'users';
const CURRENT_USER_STORAGE_KEY = 'currentUser';
const EMAIL_VERIFICATION_PREFIX = 'emailVerification_';
const PHONE_VERIFICATION_PREFIX = 'phoneVerification_';
const PASSWORD_RESET_TOKEN_PREFIX = 'passwordResetToken_';
const APP_SETTINGS_KEY = 'appSettings';


export const getUsersFromStorage = () => storageService.getItem(USERS_STORAGE_KEY) || [];
export const saveUsersToStorage = (users) => storageService.setItem(USERS_STORAGE_KEY, users);
export const getCurrentUserFromStorage = () => storageService.getItem(CURRENT_USER_STORAGE_KEY);
export const saveCurrentUserToStorage = (user) => storageService.setItem(CURRENT_USER_STORAGE_KEY, user);
export const removeCurrentUserFromStorage = () => storageService.removeItem(CURRENT_USER_STORAGE_KEY);

export const getVerificationCode = (type, identifier) => {
  const prefix = type === 'email' ? EMAIL_VERIFICATION_PREFIX : PHONE_VERIFICATION_PREFIX;
  return storageService.getItem(`${prefix}${identifier}`);
};

export const setVerificationCode = (type, identifier, code) => {
  const prefix = type === 'email' ? EMAIL_VERIFICATION_PREFIX : PHONE_VERIFICATION_PREFIX;
  storageService.setItem(`${prefix}${identifier}`, code, 60 * 10); // 10 minutes expiry
};

export const removeVerificationCode = (type, identifier) => {
  const prefix = type === 'email' ? EMAIL_VERIFICATION_PREFIX : PHONE_VERIFICATION_PREFIX;
  storageService.removeItem(`${prefix}${identifier}`);
};

export const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const registerUser = async (email, password, name, phone, role, enableRoleSelection) => {
  const users = getUsersFromStorage();
  if (users.find(user => user.email === email)) {
    throw new Error('User with this email already exists');
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password, // In a real app, hash this password
    name,
    phone,
    role: users.length === 0 ? 'super-admin' : (enableRoleSelection ? role : 'user'),
    emailVerified: false,
    phoneVerified: false,
    profileImageUrl: '',
    createdAt: new Date().toISOString(),
    disabled: false,
  };
  users.push(newUser);
  saveUsersToStorage(users);
  return newUser;
};

export const authenticateUser = async (email, password) => {
  const users = getUsersFromStorage();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password');
  if (user.disabled) throw new Error('Your account has been disabled. Please contact support.');
  return user;
};

export const confirmEmailVerification = async (email, code) => {
  const storedCode = getVerificationCode('email', email);
  if (!storedCode || storedCode !== code) throw new Error('Invalid verification code');

  const users = getUsersFromStorage();
  const updatedUsers = users.map(u => u.email === email ? { ...u, emailVerified: true } : u);
  saveUsersToStorage(updatedUsers);
  removeVerificationCode('email', email);

  const user = updatedUsers.find(u => u.email === email);
  if (user && !user.phoneVerified) {
    const phoneCode = generateVerificationCode();
    setVerificationCode('phone', user.phone, phoneCode);
    return { verified: true, nextStep: 'phone', phone: user.phone, email: user.email };
  }
  return { verified: true, nextStep: 'login' };
};

export const confirmPhoneVerification = async (phone, code, email) => {
  const storedCode = getVerificationCode('phone', phone);
  if (!storedCode || storedCode !== code) throw new Error('Invalid verification code');

  let users = getUsersFromStorage();
  let loggedInUser = null;
  const updatedUsers = users.map(u => {
    if (u.phone === phone) {
      const updatedUser = { ...u, phoneVerified: true };
      if (email && u.email === email && u.emailVerified) { // User is verifying phone after email during login/signup flow
        const { password: _, ...userToLogin } = updatedUser;
        loggedInUser = userToLogin;
      }
      return updatedUser;
    }
    return u;
  });
  saveUsersToStorage(updatedUsers);
  removeVerificationCode('phone', phone);

  if (loggedInUser) {
    saveCurrentUserToStorage(loggedInUser);
  }
  return { verified: true, loggedInUser };
};

export const initiatePasswordReset = async (email) => {
  const users = getUsersFromStorage();
  const user = users.find(u => u.email === email);
  if (!user) {
    // Don't reveal if user exists for security, but for demo we can throw
    console.warn(`Password reset requested for non-existent email: ${email}`);
    return; // Silently fail or throw new Error('User not found'); for stricter check
  }
  const token = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;
  storageService.setItem(`${PASSWORD_RESET_TOKEN_PREFIX}${token}`, { email: user.email, expires: Date.now() + 3600000 }, 3600); // 1 hour expiry
  console.log(`Password reset token for ${email}: ${token} (Link: /reset-password/${token})`); // Simulate sending email
  return token;
};

export const completePasswordReset = async (token, newPassword) => {
  const tokenData = storageService.getItem(`${PASSWORD_RESET_TOKEN_PREFIX}${token}`);
  if (!tokenData || tokenData.expires < Date.now()) {
    throw new Error('Invalid or expired password reset token.');
  }
  
  const users = getUsersFromStorage();
  const userIndex = users.findIndex(u => u.email === tokenData.email);
  if (userIndex === -1) throw new Error('User not found for this token.');

  users[userIndex].password = newPassword; // In real app, hash this
  saveUsersToStorage(users);
  storageService.removeItem(`${PASSWORD_RESET_TOKEN_PREFIX}${token}`);
  return true;
};
