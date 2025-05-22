
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, PlusCircle, Building, Globe, Package as PackageIcon, ClipboardList as TaskIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast";
import { useData } from '@/contexts/DataContext';


const CLIENTS_STORAGE_KEY = 'clients_data';
const DOMAINS_STORAGE_KEY = 'hostingDomains'; // Assuming domains are stored with this key
const PACKAGES_STORAGE_KEY = 'hostingPackages';
const TASKS_STORAGE_KEY = 'tasks';

const initialSampleClients = [
  { id: '1', name: 'Tech Solutions Inc.', companyName: 'Tech Solutions Incorporated', email: 'contact@techsolutions.com', phone: '555-0101', status: 'Active', projects: 3, joined: '2023-01-15', domainId: null, packageId: null, taskIds: [] },
  { id: '2', name: 'Innovate Hub', companyName: 'Innovate Hub LLC', email: 'hello@innovatehub.io', phone: '555-0102', status: 'Active', projects: 5, joined: '2022-11-20', domainId: null, packageId: null, taskIds: [] },
];

const getStoredData = (key, fallback) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      console.error(`Failed to parse ${key} from localStorage`, error);
      return fallback;
    }
  }
  return fallback;
};

const storeData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const Clients = () => {
  const { clients, setClients, domains, packages, tasks, setTasks } = useData();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [newClientData, setNewClientData] = useState({ name: '', companyName: '', email: '', phone: '', domainId: '', packageId: '', initialTaskDescription: ''});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setNewClientData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrEditClient = () => {
    if (!newClientData.name || !newClientData.companyName || !newClientData.email) {
        toast({
            title: "Missing Information",
            description: "Please fill in Contact Name, Company Name, and Email.",
            variant: "destructive",
        });
        return;
    }

    let clientTaskIds = currentClient ? currentClient.taskIds || [] : [];

    if (newClientData.initialTaskDescription) {
      const newTask = {
        id: uuidv4(),
        title: newClientData.initialTaskDescription,
        project: `Client: ${newClientData.companyName || newClientData.name}`,
        assignedTo: 'Unassigned', 
        priority: 'Medium',
        status: 'Pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Due in 7 days
        timeTracked: 0,
        timerRunning: false,
        clientId: currentClient ? currentClient.id : uuidv4() // Will be set properly below
      };
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      clientTaskIds = [...clientTaskIds, newTask.id];
    }

    if (currentClient) { 
      const updatedClient = { 
        ...currentClient, 
        ...newClientData,
        taskIds: clientTaskIds 
      };
      setClients(prev => prev.map(c => c.id === currentClient.id ? updatedClient : c));
      toast({ title: "Client Updated", description: `${updatedClient.name} details have been updated.`});
    } else { 
      const newClientId = uuidv4();
      const newClientEntry = { 
        ...newClientData, 
        id: newClientId, 
        status: 'Pending', 
        projects: 0, 
        joined: new Date().toISOString().split('T')[0],
        taskIds: clientTaskIds.map(taskId => tasks.find(t => t.id === taskId)).filter(Boolean).map(task => {
          if(task.clientId !== newClientId){ // If task was just created and needs client ID
            const taskToUpdate = tasks.find(t => t.id === task.id);
            if(taskToUpdate) taskToUpdate.clientId = newClientId;
          }
          return task.id;
        })
      };
      setClients(prev => [...prev, newClientEntry]);
      
      if(newClientData.initialTaskDescription && clientTaskIds.length > 0) {
         const newTaskId = clientTaskIds[clientTaskIds.length -1];
         const taskToUpdate = tasks.find(t => t.id === newTaskId);
         if(taskToUpdate) taskToUpdate.clientId = newClientId;
         setTasks([...tasks]); 
      }
      toast({ title: "Client Added", description: `${newClientEntry.name} has been added.`});
    }
    setNewClientData({ name: '', companyName: '', email: '', phone: '', domainId: '', packageId: '', initialTaskDescription: '' });
    setIsModalOpen(false);
    setCurrentClient(null);
  };

  const openModal = (client = null) => {
    if (client) {
      setCurrentClient(client);
      setNewClientData({ 
        name: client.name, 
        companyName: client.companyName, 
        email: client.email, 
        phone: client.phone,
        domainId: client.domainId || '',
        packageId: client.packageId || '',
        initialTaskDescription: '' // Don't prefill task for edit, it's for new tasks
      });
    } else {
      setCurrentClient(null);
      setNewClientData({ name: '', companyName: '', email: '', phone: '', domainId: '', packageId: '', initialTaskDescription: '' });
    }
    setIsModalOpen(true);
  };
  
  const handleDeleteClient = (clientId) => {
    const clientToDelete = clients.find(c => c.id === clientId);
    setClients(prev => prev.filter(c => c.id !== clientId));
    toast({ title: "Client Deleted", description: `${clientToDelete?.name || 'Client'} has been deleted.`, variant: "destructive"});
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
          setIsModalOpen(isOpen);
          if (!isOpen) {
            setCurrentClient(null);
            setNewClientData({ name: '', companyName: '', email: '', phone: '', domainId: '', packageId: '', initialTaskDescription: '' });
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-primary">{currentClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
              <DialogDescription>
                {currentClient ? 'Update the client details below.' : 'Fill in the information for the new client.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              <div className="space-y-1">
                <Label htmlFor="name">Contact Name <span className="text-destructive">*</span></Label>
                <Input id="name" name="name" value={newClientData.name} onChange={handleInputChange} placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="companyName">Company Name <span className="text-destructive">*</span></Label>
                <Input id="companyName" name="companyName" value={newClientData.companyName} onChange={handleInputChange} placeholder="e.g. Acme Corp" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input id="email" name="email" type="email" value={newClientData.email} onChange={handleInputChange} placeholder="e.g. john.doe@example.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" value={newClientData.phone} onChange={handleInputChange} placeholder="e.g. (555) 123-4567" />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="domainId">Assign Domain</Label>
                <Select name="domainId" value={newClientData.domainId} onValueChange={(value) => handleSelectChange('domainId', value)}>
                  <SelectTrigger id="domainId">
                    <SelectValue placeholder="Select a domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {domains.map(domain => (
                      <SelectItem key={domain.id} value={domain.id}>{domain.domainName} ({domain.clientName || 'Unassigned'})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="packageId">Assign Hosting Package</Label>
                <Select name="packageId" value={newClientData.packageId} onValueChange={(value) => handleSelectChange('packageId', value)}>
                  <SelectTrigger id="packageId">
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="">None</SelectItem>
                    {packages.map(pkg => (
                      <SelectItem key={pkg.id} value={pkg.id}>{pkg.name} (${pkg.price}/mo)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="initialTaskDescription">Initial Task Description</Label>
                <Textarea id="initialTaskDescription" name="initialTaskDescription" value={newClientData.initialTaskDescription} onChange={handleInputChange} placeholder="e.g., Setup initial meeting, Onboard client to platform..." />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button type="button" onClick={handleAddOrEditClient}>
                {currentClient ? 'Save Changes' : 'Add Client'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary">Client Management</CardTitle>
          <CardDescription>Overview of all your clients.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Company Name</TableHead>
                <TableHead>Contact Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Package</TableHead>
                <TableHead>Assigned Domain</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => {
                const clientPackage = packages.find(p => p.id === client.packageId);
                const clientDomain = domains.find(d => d.id === client.domainId);
                return (
                  <TableRow key={client.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-medium text-primary">{client.companyName}</TableCell>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={client.status === 'Active' ? 'default' : client.status === 'Inactive' ? 'destructive' : 'secondary'}
                        className={`${client.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                                     client.status === 'Inactive' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                     'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{clientPackage ? clientPackage.name : <span className="text-muted-foreground">N/A</span>}</TableCell>
                    <TableCell>{clientDomain ? clientDomain.domainName : <span className="text-muted-foreground">N/A</span>}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => openModal(client)} className="border-primary text-primary hover:bg-primary/10">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteClient(client.id)} className="hover:bg-destructive/80">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
           {clients.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <Building className="mx-auto h-12 w-12 mb-2" />
              <p>No clients found. Click "Add New Client" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Clients;
