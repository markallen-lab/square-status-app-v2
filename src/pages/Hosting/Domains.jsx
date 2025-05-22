
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Search, ArrowUpDown, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from '@/contexts/DataContext';
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

const DomainForm = ({ domainData, onSubmit, onCancel, clients }) => {
  const [domainName, setDomainName] = useState(domainData?.domainName || '');
  const [clientId, setClientId] = useState(domainData?.clientId || '');
  const [purchaseDate, setPurchaseDate] = useState(domainData?.purchaseDate || '');
  const [renewalDate, setRenewalDate] = useState(domainData?.renewalDate || '');
  const [registrar, setRegistrar] = useState(domainData?.registrar || '');
  const [status, setStatus] = useState(domainData?.status || 'Active');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!domainName || !purchaseDate || !renewalDate || !registrar) {
      alert("Please fill in all required fields.");
      return;
    }
    const client = clients.find(c => c.id === clientId);
    onSubmit({
      id: domainData?.id || `domain_${uuidv4()}`,
      domainName,
      clientId,
      clientName: client ? (client.companyName || client.name) : 'Unassigned',
      purchaseDate,
      renewalDate,
      registrar,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto p-1 custom-scrollbar">
      <div>
        <Label htmlFor="domainName">Domain Name <span className="text-destructive">*</span></Label>
        <Input id="domainName" value={domainName} onChange={(e) => setDomainName(e.target.value)} placeholder="e.g., example.com" required />
      </div>
      <div>
        <Label htmlFor="clientId">Assign to Client</Label>
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger id="clientId"><SelectValue placeholder="Select a client" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">None (Unassigned)</SelectItem>
            {clients.map(client => (
              <SelectItem key={client.id} value={client.id}>{client.companyName || client.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="purchaseDate">Purchase Date <span className="text-destructive">*</span></Label>
          <Input id="purchaseDate" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="renewalDate">Renewal Date <span className="text-destructive">*</span></Label>
          <Input id="renewalDate" type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} required />
        </div>
      </div>
      <div>
        <Label htmlFor="registrar">Registrar <span className="text-destructive">*</span></Label>
        <Input id="registrar" value={registrar} onChange={(e) => setRegistrar(e.target.value)} placeholder="e.g., GoDaddy, Namecheap" required />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Expires Soon">Expires Soon</SelectItem>
            <SelectItem value="Expired">Expired</SelectItem>
            <SelectItem value="Transferred Out">Transferred Out</SelectItem>
            <SelectItem value="Pending Transfer">Pending Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="pt-4">
        <DialogClose asChild><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></DialogClose>
        <Button type="submit">{domainData ? 'Update Domain' : 'Add Domain'}</Button>
      </DialogFooter>
    </form>
  );
};

const HostingDomains = () => {
  const { domains, setDomains, clients } = useData();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddOrEditDomain = (domainData) => {
    if (editingDomain) {
      setDomains(prev => prev.map(d => d.id === editingDomain.id ? domainData : d));
      toast({ title: "Domain Updated", description: `${domainData.domainName} has been updated.` });
    } else {
      setDomains(prev => [...prev, domainData]);
      toast({ title: "Domain Added", description: `${domainData.domainName} has been added.` });
    }
    setIsModalOpen(false);
    setEditingDomain(null);
  };

  const openModal = (domain = null) => {
    setEditingDomain(domain);
    setIsModalOpen(true);
  };

  const handleDeleteDomain = (domainId) => {
    const domainToDelete = domains.find(d => d.id === domainId);
    setDomains(prev => prev.filter(d => d.id !== domainId));
    toast({ title: "Domain Deleted", description: `${domainToDelete?.domainName} has been deleted.`, variant: "destructive" });
  };

  const filteredDomains = domains.filter(domain => 
    domain.domainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (domain.clientName && domain.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Domains</h1>
          <p className="text-muted-foreground">Manage and track all client domain information.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
          setIsModalOpen(isOpen);
          if (!isOpen) setEditingDomain(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Domain
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-primary">{editingDomain ? 'Edit Domain' : 'Add New Domain'}</DialogTitle>
              <DialogDescription>
                {editingDomain ? 'Update the domain details.' : 'Fill in the information for the new domain.'}
              </DialogDescription>
            </DialogHeader>
            <DomainForm 
              domainData={editingDomain} 
              onSubmit={handleAddOrEditDomain} 
              onCancel={() => { setIsModalOpen(false); setEditingDomain(null); }}
              clients={clients}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="text-primary">Domain Registry</CardTitle>
          <CardDescription>
            View, search, and manage domain details.
          </CardDescription>
          <div className="mt-4 flex items-center gap-2">
            <Input 
              placeholder="Search domains or clients..." 
              className="max-w-sm" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" size="icon"><Search className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Client</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Renewal Date</TableHead>
                <TableHead>Registrar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDomains.map((domain) => (
                <TableRow key={domain.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-primary">{domain.clientName || 'N/A'}</TableCell>
                  <TableCell>{domain.domainName}</TableCell>
                  <TableCell>{domain.purchaseDate}</TableCell>
                  <TableCell>{domain.renewalDate}</TableCell>
                  <TableCell>{domain.registrar}</TableCell>
                  <TableCell>
                    <Badge variant={
                      domain.status === 'Active' ? 'default' : 
                      domain.status === 'Expires Soon' ? 'secondary' : 
                      'destructive'
                    }
                    className={
                      domain.status === 'Active' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-400 border-green-500/50' :
                      domain.status === 'Expires Soon' ? 'bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-400 border-amber-500/50' :
                      'bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-400 border-red-500/50'
                    }>
                      {domain.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                     <Button variant="outline" size="icon" onClick={() => openModal(domain)} className="border-primary text-primary hover:bg-primary/10">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteDomain(domain.id)} className="hover:bg-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {filteredDomains.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <Globe className="mx-auto h-12 w-12 mb-2" />
              <p>No domains found. {searchTerm && "Try adjusting your search."} Click "Add New Domain" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HostingDomains;
