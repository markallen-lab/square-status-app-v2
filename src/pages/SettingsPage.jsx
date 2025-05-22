
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, DollarSign } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from "@/components/ui/use-toast";

const SettingsPage = () => {
  const { settings, updateSettings, supportedCurrencies } = useSettings();
  const { toast } = useToast();

  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [selectedCurrency, setSelectedCurrency] = useState(settings.currency);
  
  useEffect(() => {
    setNotificationsEnabled(settings.notificationsEnabled);
    setDarkMode(settings.darkMode);
    setSelectedCurrency(settings.currency);
  }, [settings]);

  const handleSaveChanges = () => {
    updateSettings({ 
      notificationsEnabled, 
      darkMode,
      currency: selectedCurrency 
    });
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <Card className="shadow-md bg-card border-border">
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Manage your application preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-base">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates and alerts.
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="darkMode" className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark themes. (Theme switching UI not fully implemented yet)
              </p>
            </div>
            <Switch
              id="darkMode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-base">Currency</Label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger id="currency" className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {supportedCurrencies.map(curr => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.name} ({curr.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Choose your preferred currency for financial displays.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-base">API Key</Label>
            <Input id="apiKey" type="text" placeholder="Enter your API key" defaultValue="********-****-****-****-************" readOnly className="bg-muted/50 cursor-not-allowed"/>
            <p className="text-sm text-muted-foreground">
              Manage your API integration key (currently read-only).
            </p>
          </div>

        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </CardFooter>
      </Card>

       <Card className="shadow-md bg-card border-border">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage your application data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
            <Button variant="outline">Export Data</Button>
            <p className="text-sm text-muted-foreground mt-1">Download your data in CSV format.</p>
           </div>
           <div>
            <Button variant="destructive">Delete Account</Button>
            <p className="text-sm text-muted-foreground mt-1">Permanently delete your account and all associated data.</p>
           </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SettingsPage;
