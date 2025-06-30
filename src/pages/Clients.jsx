import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // New client form state
  const [newClient, setNewClient] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    company_name: '',
    company_email: '',
    company_address: '',
    company_phone: '',
    company_fax: '',
    company_industry: '',
    domain: '',
    package: '',
    status: 'Pending',
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    fetch('http://localhost/squarestatusApp/api/getClients.php')
      .then((res) => res.json())
      .then((data) => {
        if (data.clients) {
          setClients(data.clients);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to fetch clients.',
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

  const openModal = () => {
    setNewClient({
      name: '',
      lastname: '',
      email: '',
      phone: '',
      company_name: '',
      company_email: '',
      company_address: '',
      company_phone: '',
      company_fax: '',
      company_industry: '',
      domain: '',
      package: '',
      status: 'Pending',
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        'http://localhost/squarestatusApp/api/add-client.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newClient),
        }
      );
      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Client added successfully',
          variant: 'default',
        });
        setIsModalOpen(false);
        fetchClients(); // Refresh client list
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to add client',
          variant: 'destructive',
        });
      }
    } catch (error) {
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
        <div className="sectionHeader flex justify-between items-start">
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <button
            className="bg-blue-500 text-white px-4 py-3 rounded"
            onClick={openModal}>
            Add Client
          </button>
        </div>

        <Card className="shadow-md bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary">Client Management</CardTitle>
            <CardDescription>
              Overview of all registered clients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.company_name}</TableCell>
                      <TableCell>{client.domain || '—'}</TableCell>
                      <TableCell>{client.package || '—'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            client.status === 'Active'
                              ? 'default'
                              : client.status === 'Inactive'
                              ? 'destructive'
                              : 'secondary'
                          }>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/clients/${client.id}`}>
                          <Button variant="outline">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan="5"
                      className="text-center text-muted-foreground py-6">
                      No clients found.
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
            <h2 className="text-xl font-bold mb-2">Add New Client</h2>

            <input
              type="text"
              name="name"
              placeholder="Contact First Name *"
              value={newClient.name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              name="lastname"
              placeholder="Contact Last Name"
              value={newClient.lastname}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Contact Email *"
              value={newClient.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Contact Phone"
              value={newClient.phone}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="company_name"
              placeholder="Company Name *"
              value={newClient.company_name}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="email"
              name="company_email"
              placeholder="Company Email"
              value={newClient.company_email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="company_address"
              placeholder="Company Address"
              value={newClient.company_address}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="tel"
              name="company_phone"
              placeholder="Company Phone"
              value={newClient.company_phone}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="tel"
              name="company_fax"
              placeholder="Company Fax"
              value={newClient.company_fax}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="company_industry"
              placeholder="Company Industry"
              value={newClient.company_industry}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="domain"
              placeholder="Domain"
              value={newClient.domain}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="package"
              placeholder="Package"
              value={newClient.package}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />

            <select
              name="status"
              value={newClient.status}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Save
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Clients;
