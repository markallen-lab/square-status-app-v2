
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter as DialogFooterPrimitive, DialogClose } from '@/components/ui/dialog'; // Renamed DialogFooter to avoid conflict
import { v4 as uuidv4 } from 'uuid';

const PackageForm = ({ packageData, onSubmit, onCancel }) => {
  const [name, setName] = useState(packageData?.name || '');
  const [price, setPrice] = useState(packageData?.price || '');
  const [storage, setStorage] = useState(packageData?.storage || '');
  const [bandwidth, setBandwidth] = useState(packageData?.bandwidth || '');
  const [websites, setWebsites] = useState(packageData?.websites || '');
  const [emailAccounts, setEmailAccounts] = useState(packageData?.emailAccounts || '');
  const [hostingType, setHostingType] = useState(packageData?.hostingType || '');
  const [targetAudience, setTargetAudience] = useState(packageData?.targetAudience || '');
  const [features, setFeatures] = useState(packageData?.features?.join(', ') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !hostingType || !targetAudience) {
      alert("Please fill in all required fields: Name, Price, Hosting Type, and Target Audience.");
      return;
    }
    onSubmit({
      id: packageData?.id || `pkg_${uuidv4()}`, // Ensure unique ID format
      name,
      price: parseFloat(price),
      storage,
      bandwidth,
      websites: parseInt(websites) || websites.toString(), // Keep as string if not parseable
      emailAccounts: parseInt(emailAccounts) || emailAccounts.toString(), // Keep as string
      hostingType,
      targetAudience,
      features: features.split(',').map(f => f.trim()).filter(f => f),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto p-1 custom-scrollbar">
      <div>
        <Label htmlFor={`form-pkg-name-${packageData?.id || 'new'}`}>Package Name <span className="text-destructive">*</span></Label>
        <Input id={`form-pkg-name-${packageData?.id || 'new'}`} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Starter Plan" required />
      </div>
      <div>
        <Label htmlFor={`form-pkg-price-${packageData?.id || 'new'}`}>Price (USD per month) <span className="text-destructive">*</span></Label>
        <Input id={`form-pkg-price-${packageData?.id || 'new'}`} type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 9.99" required />
      </div>
      <div>
        <Label htmlFor={`form-pkg-hosting-type-${packageData?.id || 'new'}`}>Hosting Type <span className="text-destructive">*</span></Label>
        <Select value={hostingType} onValueChange={setHostingType} required>
          <SelectTrigger id={`form-pkg-hosting-type-${packageData?.id || 'new'}`}>
            <SelectValue placeholder="Select hosting type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Shared">Shared Hosting</SelectItem>
            <SelectItem value="VPS">VPS Hosting</SelectItem>
            <SelectItem value="Dedicated">Dedicated Server</SelectItem>
            <SelectItem value="Cloud">Cloud Hosting</SelectItem>
            <SelectItem value="WordPress">Managed WordPress</SelectItem>
            <SelectItem value="Reseller">Reseller Hosting</SelectItem>
          </SelectContent>
        </Select>
      </div>
       <div>
        <Label htmlFor={`form-pkg-target-audience-${packageData?.id || 'new'}`}>Target Audience <span className="text-destructive">*</span></Label>
        <Input id={`form-pkg-target-audience-${packageData?.id || 'new'}`} value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g., Small Businesses, Developers" required />
      </div>
      <div>
        <Label htmlFor={`form-pkg-storage-${packageData?.id || 'new'}`}>Storage</Label>
        <Input id={`form-pkg-storage-${packageData?.id || 'new'}`} value={storage} onChange={(e) => setStorage(e.target.value)} placeholder="e.g., 50GB SSD" />
      </div>
      <div>
        <Label htmlFor={`form-pkg-bandwidth-${packageData?.id || 'new'}`}>Bandwidth</Label>
        <Input id={`form-pkg-bandwidth-${packageData?.id || 'new'}`} value={bandwidth} onChange={(e) => setBandwidth(e.target.value)} placeholder="e.g., 1TB" />
      </div>
      <div>
        <Label htmlFor={`form-pkg-websites-${packageData?.id || 'new'}`}>Websites Allowed</Label>
        <Input id={`form-pkg-websites-${packageData?.id || 'new'}`} value={websites} onChange={(e) => setWebsites(e.target.value)} placeholder="e.g., 1 or Unlimited" />
      </div>
      <div>
        <Label htmlFor={`form-pkg-emails-${packageData?.id || 'new'}`}>Email Accounts</Label>
        <Input id={`form-pkg-emails-${packageData?.id || 'new'}`} value={emailAccounts} onChange={(e) => setEmailAccounts(e.target.value)} placeholder="e.g., 10 or Unlimited" />
      </div>
      <div>
        <Label htmlFor={`form-pkg-features-${packageData?.id || 'new'}`}>Features (comma-separated)</Label>
        <Textarea id={`form-pkg-features-${packageData?.id || 'new'}`} value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="e.g., Free SSL, Daily Backups, 24/7 Support" />
      </div>
      <DialogFooterPrimitive className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </DialogClose>
        <Button type="submit">{packageData ? 'Update' : 'Add'} Package</Button>
      </DialogFooterPrimitive>
    </form>
  );
};

export default PackageForm;
