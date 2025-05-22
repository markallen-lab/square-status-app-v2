
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck, ShieldAlert, UserCog } from 'lucide-react';

const UserStatus = () => {
  const { getAllUsers, updateUserAccountStatus, currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchedUsers = getAllUsers();
    setUsers(fetchedUsers);
  }, [getAllUsers]);

  const handleStatusToggle = async (userId, currentStatus) => {
    // Example: Toggling 'disabled' status. In a real app, you might have an 'isActive' field.
    // For this localStorage example, let's assume 'disabled' is a boolean property on user.
    const newDisabledStatus = !currentStatus; 
    try {
      const updatedUser = await updateUserAccountStatus(userId, { disabled: newDisabledStatus });
      if (updatedUser) {
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, disabled: newDisabledStatus } : u));
        toast({ title: "User Status Updated", description: `${updatedUser.name}'s account status changed.` });
      }
    } catch (error) {
       toast({ variant: "destructive", title: "Update Failed", description: error.message });
    }
  };

  const handleRoleChange = async (userId, newRole) => {
     if (currentUser.id === userId && newRole !== 'super-admin') {
        toast({ variant: "destructive", title: "Action Restricted", description: "Super admin cannot demote themselves."});
        return;
    }
    try {
      const updatedUser = await updateUserAccountStatus(userId, { role: newRole });
      if (updatedUser) {
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
        toast({ title: "User Role Updated", description: `${updatedUser.name}'s role changed to ${newRole}.` });
      }
    } catch (error) {
       toast({ variant: "destructive", title: "Update Failed", description: error.message });
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold tracking-tight">User Account Status & Roles</h1>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Manage User Status</CardTitle>
          <CardDescription>Enable, disable, or change roles for user accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select 
                        value={user.role} 
                        onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                        disabled={user.id === currentUser.id && user.role === 'super-admin'}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="super-admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {user.disabled ? 
                        <span className="flex items-center text-red-600"><ShieldAlert className="mr-2 h-4 w-4" />Disabled</span> : 
                        <span className="flex items-center text-green-600"><ShieldCheck className="mr-2 h-4 w-4" />Active</span>
                      }
                    </TableCell>
                    <TableCell className="text-center">
                       <div className="flex items-center space-x-2 justify-center">
                        <Label htmlFor={`status-switch-${user.id}`} className="text-sm">
                          {user.disabled ? 'Enable' : 'Disable'}
                        </Label>
                        <Switch
                          id={`status-switch-${user.id}`}
                          checked={!user.disabled}
                          onCheckedChange={() => handleStatusToggle(user.id, user.disabled)}
                          disabled={user.id === currentUser.id && user.role === 'super-admin'} // Super admin cannot disable own account
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No users found to manage.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserStatus;
