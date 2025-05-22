
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  BarChart,
  PieChart,
  Activity,
  Calendar
} from 'lucide-react';

// Sample data for charts
const generateRandomData = (count, max) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * max) + 1);
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const revenueData = generateRandomData(12, 10000);
const userSignupsData = generateRandomData(12, 100);

const StatCard = ({ icon, title, value, trend, trendValue }) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          <div className={`p-2 rounded-full ${trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
            <TrendingUp className={`h-4 w-4 inline mr-1 ${trend === 'up' ? '' : 'transform rotate-180'}`} />
            {trendValue}
          </span>
          <span className="text-muted-foreground ml-1">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{greeting}, {currentUser?.name}</h1>
        <p className="text-muted-foreground">Here's what's happening with your business today.</p>
      </div>
      
      <Separator />
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatCard 
            icon={<Users className="h-5 w-5 text-blue-600" />}
            title="Total Users"
            value="2,543"
            trend="up"
            trendValue="12.5%"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatCard 
            icon={<ShoppingCart className="h-5 w-5 text-green-600" />}
            title="Total Orders"
            value="1,345"
            trend="up"
            trendValue="8.2%"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatCard 
            icon={<DollarSign className="h-5 w-5 text-purple-600" />}
            title="Total Revenue"
            value="$45,231"
            trend="up"
            trendValue="5.4%"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <StatCard 
            icon={<Activity className="h-5 w-5 text-red-600" />}
            title="Active Sessions"
            value="324"
            trend="down"
            trendValue="3.1%"
          />
        </motion.div>
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between">
                {revenueData.map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-7 bg-primary rounded-t-md transition-all duration-500 ease-in-out hover:bg-primary/80"
                      style={{ height: `${(value / 10000) * 250}px` }}
                    ></div>
                    <span className="text-xs mt-2 text-muted-foreground">{months[index]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">User Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between">
                {userSignupsData.map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-7 bg-blue-500 rounded-t-md transition-all duration-500 ease-in-out hover:bg-blue-400"
                      style={{ height: `${(value / 100) * 250}px` }}
                    ></div>
                    <span className="text-xs mt-2 text-muted-foreground">{months[index]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New user registered
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Date.now() - i * 3600000).toLocaleString()}
                    </p>
                  </div>
                  <div className={`rounded-full px-2 py-1 text-xs ${
                    i % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {i % 2 === 0 ? 'Completed' : 'In Progress'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
