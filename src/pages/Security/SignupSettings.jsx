
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save } from 'lucide-react';

const SignupSettings = () => {
  const { appSettings, updateAppSettings } = useAuth();

  const handleToggleRoleSelection = () => {
    updateAppSettings({ 
      ...appSettings, 
      enableRoleSelectionOnSignup: !appSettings.enableRoleSelectionOnSignup 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Signup Form Settings</h1>
      
      <Card className="shadow-xl bg-slate-800 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-purple-400">Role Selection</CardTitle>
          <CardDescription className="text-slate-400">
            Control whether users can select their role during the signup process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/50 border border-slate-600">
            <div className="space-y-0.5">
              <Label htmlFor="enableRoleSelection" className="text-base font-medium text-slate-200">
                Enable Role Selection on Signup Form
              </Label>
              <p className="text-sm text-slate-400">
                If enabled, users can choose between 'User' and 'Admin' roles. If disabled, all new signups default to 'User'.
              </p>
            </div>
            <Switch
              id="enableRoleSelection"
              checked={appSettings.enableRoleSelectionOnSignup}
              onCheckedChange={handleToggleRoleSelection}
              className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-slate-600"
            />
          </div>
        </CardContent>
        <CardFooter className="border-t border-slate-700 pt-6">
           <p className="text-xs text-slate-500">
            Note: The 'Super Admin' role can only be assigned manually or is given to the first registered user.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SignupSettings;
