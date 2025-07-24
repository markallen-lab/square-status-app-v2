import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, PlusCircle, MessageSquare, Zap } from 'lucide-react';

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
  const [leads, setLeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [newLeadData, setNewLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    notes: '',
    pipelineStage: 'Prospecting',
    status: 'New',
    assignedTo: 'Unassigned',
    lastContact: new Date().toISOString().split('T')[0],
  });
  const { toast } = useToast();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    fetch(`${apiUrl}/getLeads.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.leads) {
          setLeads(data.leads);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to fetch leads.',
            variant: 'destructive',
          });
        }
      })
      .catch(() =>
        toast({
          title: 'Error',
          description: 'Network or server error occurred.',
          variant: 'destructive',
        })
      );
  };

  const openAddModal = () => {
    setCurrentLead(null);
    setNewLeadData({
      name: '',
      email: '',
      phone: '',
      source: '',
      notes: '',
      pipelineStage: 'Prospecting',
      status: 'New',
      assignedTo: 'Unassigned',
      lastContact: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (lead) => {
    setCurrentLead(lead);
    setNewLeadData({ ...lead });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setNewLeadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = currentLead
      ? `${apiUrl}/update-lead.php`
      : `${apiUrl}/add-lead.php`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeadData),
      });

      const text = await response.text();

      const data = JSON.parse(text);
      if (data.success) {
        toast({
          title: 'Success',
          description: currentLead ? 'Lead updated.' : 'Lead added.',
          variant: 'default',
        });
        setIsModalOpen(false);
        setCurrentLead(null);
        fetchLeads();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save lead',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast({
        title: 'Error',
        description: 'Network or server error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteLead = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`${apiUrl}/delete-lead.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Deleted',
          description: 'Lead deleted successfully.',
          variant: 'default',
        });
        fetchLeads();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete lead',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Network or server error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <Button onClick={openAddModal}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Lead
          </Button>
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
                {leads.length > 0 ? (
                  leads.map((lead) => (
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
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteLead(lead.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan="8"
                      className="text-center text-muted-foreground py-6">
                      No leads found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-lg max-w-lg w-full space-y-4">
            <h2 className="text-xl font-bold mb-2">
              {currentLead ? 'Edit Lead' : 'Add New Lead'}
            </h2>

            <input
              type="text"
              name="name"
              placeholder="Name *"
              value={newLeadData.name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={newLeadData.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={newLeadData.phone}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="source"
              placeholder="Source"
              value={newLeadData.source}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <select
              name="pipelineStage"
              value={newLeadData.pipelineStage}
              onChange={(e) =>
                handleSelectChange('pipelineStage', e.target.value)
              }
              className="w-full border p-2 rounded"
              required>
              {pipelineStages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
            <textarea
              name="notes"
              placeholder="Notes"
              value={newLeadData.notes}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              rows={3}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default">
                {currentLead ? 'Save Changes' : 'Add Lead'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Leads;
