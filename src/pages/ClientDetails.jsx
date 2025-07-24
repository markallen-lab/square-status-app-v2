import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/client.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setClient(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load client:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-6">Loading client data...</p>;
  if (!client) return <p className="p-6 text-red-500">Client not found.</p>;

  const statusColor =
    client.status === 'Active'
      ? 'bg-green-500/20 text-green-600'
      : client.status === 'Inactive'
      ? 'bg-red-500/20 text-red-600'
      : 'bg-yellow-400/20 text-yellow-600';

  return (
    <div className="p-6 space-y-6">
      {/* Company Name + Status */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{client.company_name}</h1>
        <Badge className={`border ${statusColor}`}>{client.status}</Badge>
      </div>

      {/* Contact Person Block */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Person</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <strong>Name:</strong> {client.name} {client.lastname || ''}
          </p>
          <p>
            <strong>Email:</strong> {client.email}
          </p>
          <p>
            <strong>Cell:</strong> {client.phone || 'N/A'}
          </p>
        </CardContent>
      </Card>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <strong>Company Email:</strong> {client.company_email || 'N/A'}
          </p>
          <p>
            <strong>Address:</strong> {client.company_address || 'N/A'}
          </p>
          <p>
            <strong>Phone:</strong> {client.company_phone || 'N/A'}
          </p>
          <p>
            <strong>Fax:</strong> {client.company_fax || 'N/A'}
          </p>
          <p>
            <strong>Industry:</strong> {client.company_industry || 'N/A'}
          </p>
        </CardContent>
      </Card>

      {/* Hosting Info */}
      <Card>
        <CardHeader>
          <CardTitle>Hosting Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <strong>Domain:</strong> {client.domain || 'N/A'}
          </p>
          <p>
            <strong>Package:</strong> {client.package || 'N/A'}
          </p>
        </CardContent>
      </Card>

      {/* Status Control */}
      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Button
              variant={client.status === 'Active' ? 'default' : 'outline'}
              onClick={() => updateStatus('Active')}>
              Set Active
            </Button>
            <Button
              variant={client.status === 'Inactive' ? 'destructive' : 'outline'}
              onClick={() => updateStatus('Inactive')}>
              Set Inactive
            </Button>
            <Button
              variant={client.status === 'Pending' ? 'outline' : 'ghost'}
              onClick={() => updateStatus('Pending')}>
              Set Pending
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" /> Delete Client
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            <Pencil className="w-4 h-4 mr-2" /> Edit Client Details
          </Button>
        </CardContent>
      </Card>

      {isEditModalOpen && editingClient && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto py-10">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded shadow-lg w-full max-w-3xl space-y-6">
            <h2 className="text-2xl font-bold mb-4">Edit Client</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="First Name"
                value={editingClient.name}
                onChange={handleEditInputChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={editingClient.lastname}
                onChange={handleEditInputChange}
                className="border p-2 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={editingClient.email}
                onChange={handleEditInputChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="company_name"
                placeholder="Company Name"
                value={editingClient.company_name}
                onChange={handleEditInputChange}
                className="border p-2 rounded"
                required
              />
              {/* Add more fields as needed */}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Update
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  function updateStatus(newStatus) {
    fetch(`${apiUrl}/update-status.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: client.id, status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setClient({ ...client, status: newStatus });
        }
      });
  }

  function handleDelete() {
    if (confirm('Are you sure you want to delete this client?')) {
      fetch(`${apiUrl}/delete-client.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: client.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert('Client deleted.');
            navigate('/clients'); // ✅ smoother route transition using React Router
          } else {
            alert('Failed to delete client.');
            console.error(data.error);
          }
        })
        .catch((err) => {
          console.error('Delete failed:', err);
          alert('An error occurred while deleting the client.');
        });
    }
  }

  function handleEdit() {
    setEditingClient(client); // pass the current client into the edit form
    setIsEditModalOpen(true); // open the modal
  }

  function handleEditInputChange(e) {
    const { name, value } = e.target;
    setEditingClient((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditSubmit(e) {
    e.preventDefault();

    fetch(`${apiUrl}/update-client.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingClient),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert('Client updated successfully');
          setClient(editingClient); // update displayed client info
          setIsEditModalOpen(false); // close modal
        } else {
          alert('Failed to update client.');
          console.error(data.error);
        }
      })
      .catch((err) => {
        console.error('Update failed:', err);
        alert('An error occurred while updating the client.');
      });
  }
};

export default ClientDetails;
