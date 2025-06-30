import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost/squarestatusApp/api/client.php?id=${id}`)
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
    </div>
  );

  function updateStatus(newStatus) {
    fetch(`http://localhost/squarestatusApp/api/update-status.php`, {
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
      fetch(`http://localhost/squarestatusApp/api/delete-client.php`, {
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
    // Navigate to an edit page or open a modal — up to you
    alert('Edit function to be implemented.');
  }
};

export default ClientDetails;
