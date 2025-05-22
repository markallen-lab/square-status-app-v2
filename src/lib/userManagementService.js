
import * as authService from './authService'; // Uses functions from authService for storage access

export const updateUserProfile = async (userId, profileData) => {
  const users = authService.getUsersFromStorage();
  let updatedUser = null;
  const updatedUsers = users.map(u => {
    if (u.id === userId) {
      updatedUser = { ...u, ...profileData };
      return updatedUser;
    }
    return u;
  });
  authService.saveUsersToStorage(updatedUsers);
  
  // If the updated user is the current user, update their stored session
  const currentUser = authService.getCurrentUserFromStorage();
  if (currentUser && currentUser.id === userId) {
    const { password, ...safeUpdatedUser } = updatedUser;
    authService.saveCurrentUserToStorage(safeUpdatedUser);
    return safeUpdatedUser; // Return the version for current user state
  }
  
  const { password, ...safeReturnUser } = updatedUser;
  return safeReturnUser; // Return for general updates
};

export const changeUserPassword = async (userId, newPassword) => {
  const users = authService.getUsersFromStorage();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error("User not found");

  users[userIndex].password = newPassword; // In a real app, hash this password
  authService.saveUsersToStorage(users);
  return true;
};

export const getAllUsers = () => {
  const users = authService.getUsersFromStorage();
  return users.map(({ password, ...user }) => user); // Exclude passwords
};

export const updateUserStatus = async (userIdToUpdate, updates, currentSuperAdminId) => {
  const users = authService.getUsersFromStorage();
  let R_updatedUser = null;

  // Prevent super-admin from disabling or demoting themselves
  if (userIdToUpdate === currentSuperAdminId) {
    if (updates.hasOwnProperty('disabled') && updates.disabled === true) {
      throw new Error("Super admin cannot disable their own account.");
    }
    if (updates.hasOwnProperty('role') && updates.role !== 'super-admin') {
      throw new Error("Super admin cannot demote themselves.");
    }
  }

  const updatedUsers = users.map(u => {
    if (u.id === userIdToUpdate) {
      R_updatedUser = { ...u, ...updates };
      return R_updatedUser;
    }
    return u;
  });
  authService.saveUsersToStorage(updatedUsers);
  
  const { password, ...safeUpdatedUser } = R_updatedUser;
  return safeUpdatedUser;
};
