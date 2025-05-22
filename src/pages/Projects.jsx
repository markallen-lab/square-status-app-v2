
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Projects = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
         <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Project details and management will be displayed here.</p>
          <img  alt="Team working on a project" src="https://images.unsplash.com/photo-1538688554366-621d446302aa" />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Projects;
