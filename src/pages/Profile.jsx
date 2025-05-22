
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UploadCloud, Save, KeyRound } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Profile = () => {
  const { currentUser, updateUserProfile, changeUserPassword } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [profileImage, setProfileImage] = useState(currentUser?.profileImageUrl || null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async () => {
    setIsSavingProfile(true);
    try {
      await updateUserProfile({ name, phone, profileImageUrl: profileImage });
      toast({ title: "Profile Updated", description: "Your profile information has been saved." });
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Password Mismatch", description: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      toast({ variant: "destructive", title: "Password Too Short", description: "Password must be at least 6 characters." });
      return;
    }
    setIsChangingPassword(true);
    try {
      await changeUserPassword(newPassword); // Assuming changeUserPassword takes only the new password
      toast({ title: "Password Changed", description: "Your password has been updated successfully." });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({ variant: "destructive", title: "Password Change Failed", description: error.message });
    } finally {
      setIsChangingPassword(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold tracking-tight">Account Profile</h1>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and profile picture.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImage || undefined} alt={currentUser?.name} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <UploadCloud className="mr-2 h-4 w-4" /> Change Picture
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. 1MB max.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={email} disabled />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleProfileSave} disabled={isSavingProfile}>
            <Save className="mr-2 h-4 w-4" /> {isSavingProfile ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePasswordChange} disabled={isChangingPassword}>
            <KeyRound className="mr-2 h-4 w-4" /> {isChangingPassword ? 'Changing...' : 'Change Password'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default Profile;
