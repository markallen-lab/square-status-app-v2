
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Mail, Send } from 'lucide-react';

const MarketingEmail = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Email Marketing</h1>
        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Email
        </Button>
      </div>

       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Newsletter Q1", "Promo Blast", "Welcome Series"].map((name, i) => (
          <Card key={i} className="shadow-lg bg-slate-800 border-slate-700 text-white hover:shadow-indigo-500/30 transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-400">{name}</CardTitle>
              <CardDescription className="text-slate-400">Sent: {1200 + i*300} | Opened: {70 + i*5}% | Clicked: {15+i*2}%</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-2">Last sent: 2025-04-{10+i}</p>
              <div className="flex space-x-2">
                <Button variant="outline" className="w-full border-blue-500 text-blue-500 hover:bg-blue-500/10 hover:text-blue-400">
                  <Mail className="mr-2 h-4 w-4" /> View Details
                </Button>
                 <Button variant="default" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                  <Send className="mr-2 h-4 w-4" /> Send Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-xl bg-slate-800 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-400">Email Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-slate-700/50 rounded-lg">
            <p className="text-slate-500">Email analytics chart will be displayed here.</p>
          </div>
          <img  class="mt-4 w-full h-auto rounded-md object-cover" alt="Email marketing analytics dashboard" src="https://images.unsplash.com/photo-1686061592689-312bbfb5c055" />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MarketingEmail;
