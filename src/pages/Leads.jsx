import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Trash2, PlusCircle, MessageSquare, Zap } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const initialLeads = [];

const pipelineStages = [
  'Prospecting',
  'Qualification',
  'Needs Analysis',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];

const Leads = () => {
  const [leads, setLeads] = useState(initialLeads);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [newLeadData, setNewLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    notes: '',
    pipelineStage: 'Prospecting',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setNewLeadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLead = () => {
    setLeads((prev) => [
      ...prev,
      {
        ...newLeadData,
        id: uuidv4(),
        status: 'New',
        assignedTo: 'Unassigned',
        lastContact: new Date().toISOString().split('T')[0],
      },
    ]);
    setNewLeadData({
      name: '',
      email: '',
      phone: '',
      source: '',
      notes: '',
      pipelineStage: 'Prospecting',
    });
    setIsModalOpen(false);
  };

  const openEditModal = (lead) => {
    setCurrentLead(lead);
    setNewLeadData(lead);
    setIsModalOpen(true);
  };

  const handleEditLead = () => {
    setLeads((prev) =>
      prev.map((l) => (l.id === currentLead.id ? { ...l, ...newLeadData } : l))
    );
    setCurrentLead(null);
    setNewLeadData({
      name: '',
      email: '',
      phone: '',
      source: '',
      notes: '',
      pipelineStage: 'Prospecting',
    });
    setIsModalOpen(false);
  };

  const handleDeleteLead = (id) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const convertToClient = (leadId) => {
    console.log(`Converting lead ${leadId} to client`);
    // Placeholder for conversion logic
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setCurrentLead(null);
                setNewLeadData({
                  name: '',
                  email: '',
                  phone: '',
                  source: '',
                  notes: '',
                  pipelineStage: 'Prospecting',
                });
              }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {currentLead ? 'Edit Lead' : 'Add New Lead'}
              </DialogTitle>
              <DialogDescription>
                {currentLead
                  ? 'Update the lead information.'
                  : 'Fill in the details for the new lead.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newLeadData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newLeadData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={newLeadData.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="source" className="text-right">
                  Source
                </Label>
                <Input
                  id="source"
                  name="source"
                  value={newLeadData.source}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pipelineStage" className="text-right">
                  Pipeline Stage
                </Label>
                <Select
                  name="pipelineStage"
                  value={newLeadData.pipelineStage}
                  onValueChange={(value) =>
                    handleSelectChange('pipelineStage', value)
                  }>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelineStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={newLeadData.notes}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={currentLead ? handleEditLead : handleAddLead}>
                {currentLead ? 'Save Changes' : 'Add Lead'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lead Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pipeline Stage</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        lead.status === 'New'
                          ? 'default'
                          : lead.status === 'Contacted'
                          ? 'secondary'
                          : 'outline'
                      }>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.pipelineStage}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{lead.lastContact}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditModal(lead)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        console.log('Open notes for lead:', lead.id)
                      }>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="icon"
                      onClick={() => convertToClient(lead.id)}
                      className="bg-green-500 hover:bg-green-600">
                      <Zap className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteLead(lead.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Leads;
