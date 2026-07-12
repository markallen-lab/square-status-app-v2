import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Server,
  DollarSign as DollarSignIcon,
  Zap,
  DatabaseBackup as DatabaseIcon,
  MailMinus as MailIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import PackageForm from '@/components/forms/PackageForm';

const HostingPackagesList = () => {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [packages, setPackages] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API_BASE}/getPackages.php`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch packages');
      }

      setPackages(data.packages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleAddPackage = async (newPackage) => {
    const response = await fetch(`${API_BASE}/add-package.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPackage),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error);
    }

    await fetchPackages();

    setIsFormOpen(false);

    toast({
      title: 'Package Added',
      description: 'Package created successfully.',
    });
  };

  const handleEditPackage = async (updatedPackage) => {
    try {
      const response = await fetch(`${API_BASE}/update-package.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPackage),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update package');
      }

      await fetchPackages();

      setEditingPackage(null);
      setIsFormOpen(false);

      toast({
        title: 'Package Updated',
        description: `${updatedPackage.name} has been successfully updated.`,
      });
    } catch (err) {
      toast({
        title: 'Update Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeletePackage = async (packageId) => {
    try {
      const response = await fetch(`${API_BASE}/delete-package.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: packageId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      const pkgToDelete = packages.find((p) => p.id === packageId);

      setPackages((prev) => prev.filter((p) => p.id !== packageId));

      toast({
        title: 'Package Deleted',
        description: `${pkgToDelete?.name} deleted successfully.`,
        variant: 'destructive',
      });
    } catch (err) {
      toast({
        title: 'Delete Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const openEditForm = (pkg) => {
    setEditingPackage(pkg);
    setIsFormOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hosting Packages
          </h1>
          <p className="text-muted-foreground">
            Manage your hosting service packages and pricing.
          </p>
        </div>
        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) setEditingPackage(null);
          }}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPackage(null);
                setIsFormOpen(true);
              }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Package
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-primary">
                {editingPackage
                  ? 'Edit Hosting Package'
                  : 'Add New Website Package'}
              </DialogTitle>
              <DialogDescription>
                {editingPackage
                  ? 'Update the details for this hosting package.'
                  : 'Fill in the details for the new hosting package.'}
              </DialogDescription>
            </DialogHeader>
            <PackageForm
              packageData={editingPackage}
              onSubmit={editingPackage ? handleEditPackage : handleAddPackage}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingPackage(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card border-border flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-x2 gradient-text font-bold">
                  {pkg.name}
                </CardTitle>
                <Badge variant="secondary" className="finalBackground">
                  <span className="text-white text-[18px] font-semibold text-sm mr-1">
                    R
                  </span>
                  <span className="text-white text-[18px]">{pkg.price}</span>
                  <span className="text-green-400">/{pkg.billing}</span>
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground pt-1">
                <span className="font-semibold">{pkg.bestFor}</span>{' '}
                {pkg.targetAudience}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-card-foreground flex-grow">
              <div>
                <div className="font-medium mb-2">Features:</div>

                {Array.isArray(pkg.features) &&
                  pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <DatabaseIcon
                        size={16}
                        className="text-teal-500 dark:text-teal-400"
                      />
                      <span>{feature}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/hosting/packages/${pkg.id}`)}
                className="text-accent-foreground hover:bg-accent/80">
                <Eye className="mr-1 h-4 w-4" /> View
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditForm(pkg)}
                  className="text-primary hover:bg-accent">
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the package "{pkg.name}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      {packages.length === 0 && (
        <Card className="shadow-lg border-border/60 col-span-full">
          <CardContent className="p-10 text-center">
            <img
              alt="Empty box illustration for no packages"
              className="mx-auto mb-4 w-32 h-32 text-muted-foreground"
              src="https://images.unsplash.com/photo-1560775250-9c8a0e9afd38"
            />
            <p className="text-muted-foreground">
              No hosting packages found. Click "Add New Package" to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default HostingPackagesList;
