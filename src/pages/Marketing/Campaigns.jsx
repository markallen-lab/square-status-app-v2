
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart2 } from 'lucide-react';

const MarketingCampaigns = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Marketing Campaigns</h1>
        <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Campaign
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <Card key={i} className="shadow-lg bg-slate-800 border-slate-700 text-white hover:shadow-cyan-500/30 transition-shadow">
            <CardHeader>
              <CardTitle className="text-teal-400">Campaign Alpha {i}</CardTitle>
              <CardDescription className="text-slate-400">Status: Active - Ends 2025-06-30</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-2">Reach: 15,0{i}0 | Clicks: 1,2{i}0 | Conversions: 8{i}</p>
              <div className="w-full bg-slate-700 rounded-full h-2.5 mb-4">
                <div className="bg-gradient-to-r from-teal-400 to-cyan-500 h-2.5 rounded-full" style={{ width: `${20 + i*15}%` }}></div>
              </div>
              <Button variant="outline" className="w-full border-teal-500 text-teal-500 hover:bg-teal-500/10 hover:text-teal-400">
                <BarChart2 className="mr-2 h-4 w-4" /> View Analytics
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="shadow-xl bg-slate-800 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-teal-400">Overall Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-slate-700/50 rounded-lg">
            <p className="text-slate-500">Campaign performance chart will be displayed here.</p>
          </div>
          <img  class="mt-4 w-full h-auto rounded-md object-cover" alt="Marketing campaign dashboard with charts and graphs" src="https://images.unsplash.com/photo-1625296276703-3fbc924f07b5" />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MarketingCampaigns;
