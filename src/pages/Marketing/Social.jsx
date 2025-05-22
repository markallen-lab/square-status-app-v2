
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Share2, ThumbsUp } from 'lucide-react'; // Assuming Lucide icons

const MarketingSocial = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Social Media</h1>
        <Button className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Facebook Post", "Instagram Story", "Twitter Thread"].map((name, i) => (
          <Card key={i} className="shadow-lg bg-slate-800 border-slate-700 text-white hover:shadow-rose-500/30 transition-shadow">
            <CardHeader>
              <CardTitle className="text-pink-400">{name}</CardTitle>
              <CardDescription className="text-slate-400">Platform: {name.split(' ')[0]} | Reach: {5000 + i*1500}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-2">Engagements: {300 + i*70} <ThumbsUp className="inline h-4 w-4 ml-1 text-pink-400" /></p>
              <Button variant="outline" className="w-full border-pink-500 text-pink-500 hover:bg-pink-500/10 hover:text-pink-400">
                <Share2 className="mr-2 h-4 w-4" /> View Post
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-xl bg-slate-800 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-pink-400">Social Media Engagement Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-slate-700/50 rounded-lg">
            <p className="text-slate-500">Social media engagement chart will be displayed here.</p>
          </div>
          <img  class="mt-4 w-full h-auto rounded-md object-cover" alt="Social media engagement dashboard" src="https://images.unsplash.com/photo-1686061592689-312bbfb5c055" />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MarketingSocial;
