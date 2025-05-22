
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Server, Users2, DollarSign as DollarSignIcon, Zap, DatabaseBackup as DatabaseIcon, MailMinus as MailIcon, Briefcase, CheckCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import NotFound from '@/pages/NotFound';
import PackageForm from '@/components/forms/PackageForm';
import { useData } from '@/contexts/DataContext';

const PackageDetail = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { packages, setPackages } = useData();
  const [pkg, setPkg] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  useEffect(() => {
    const currentPackage = packages.find(p => p.id === packageId);
    setPkg(currentPackage);
  }, [packageId, packages]);

  const handleUpdatePackage = (updatedPackageData) => {
    setPackages(prev => prev.map(p => p.id === updatedPackageData.id ? updatedPackageData : p));
    setIsEditFormOpen(false);
    toast({ title: "Package Updated", description: `${updatedPackageData.name} has been successfully updated.` });
  };

  const handleDeletePackage = () => {
    setPackages(prev => prev.filter(p => p.id !== packageId));
    toast({ title: "Package Deleted", description: `${pkg?.name || 'Package'} has been deleted.`, variant: "destructive" });
    navigate('/hosting/packages');
  };

  if (!pkg) {
    // Allow a brief moment for data to load, then show NotFound
    // This check might be better handled with a loading state if data fetching was async
    if (packages.length > 0) return <NotFound />;
    return <div className="flex justify-center items-center h-full"><p>Loading package details...</p></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/hosting/packages')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Packages
        </Button>
        <div className="flex gap-2">
          <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit Package
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-primary">Edit Hosting Package</DialogTitle>
                <DialogDescription>
                  Update the details for the "{pkg.name}" package.
                </DialogDescription>
              </DialogHeader>
              <PackageForm
                packageData={pkg}
                onSubmit={handleUpdatePackage}
                onCancel={() => setIsEditFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Package
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  package "{pkg.name}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeletePackage} className="bg-destructive hover:bg-destructive/90">
                  Yes, delete package
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className="shadow-xl border-border/80">
        <CardHeader className="bg-muted/30 p-6 rounded-t-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold gradient-text mb-1">{pkg.name}</CardTitle>
              <CardDescription className="text-lg">{pkg.hostingType} for {pkg.targetAudience}</CardDescription>
            </div>
            <Badge variant="secondary" className="mt-2 sm:mt-0 text-2xl px-4 py-2 bg-sky-500/20 text-sky-400 dark:text-sky-300 border-sky-500/50">
              <DollarSignIcon size={20} className="mr-2" />{pkg.price}/mo
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary mb-2 border-b pb-2">Core Specifications</h3>
            <div className="flex items-center gap-3 text-card-foreground">
              <DatabaseIcon size={20} className="text-teal-500 dark:text-teal-400" /> 
              <span><strong>Storage:</strong> {pkg.storage || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-card-foreground">
              <Zap size={20} className="text-amber-500 dark:text-amber-400" /> 
              <span><strong>Bandwidth:</strong> {pkg.bandwidth || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-card-foreground">
              <Server size={20} className="text-purple-500 dark:text-purple-400" /> 
              <span><strong>Websites:</strong> {pkg.websites || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-card-foreground">
              <MailIcon size={20} className="text-indigo-500 dark:text-indigo-400" /> 
              <span><strong>Email Accounts:</strong> {pkg.emailAccounts || 'N/A'}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary mb-2 border-b pb-2">Additional Info</h3>
            <div className="flex items-center gap-3 text-card-foreground">
              <Briefcase size={20} className="text-cyan-500 dark:text-cyan-400" /> 
              <span><strong>Hosting Type:</strong> {pkg.hostingType || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3 text-card-foreground">
              <Users2 size={20} className="text-lime-500 dark:text-lime-400" /> 
              <span><strong>Target Audience:</strong> {pkg.targetAudience || 'N/A'}</span>
            </div>
          </div>

          {pkg.features && pkg.features.length > 0 && (
            <div className="md:col-span-2 pt-4">
              <h3 className="text-xl font-semibold text-primary mb-3 border-b pb-2">Key Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-card-foreground">
                    <CheckCircle size={18} className="text-green-500 dark:text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-6 bg-muted/30 rounded-b-lg flex justify-center">
            <img  alt="Server room with glowing lights" class="w-full max-w-md h-auto rounded-md shadow-md" src="https://images.unsplash.com/photo-1506399558188-acca6f8cbf41" />
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PackageDetail;
