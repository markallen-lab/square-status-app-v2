
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import MainContent from '@/components/layouts/MainContent';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { meetings } = useData();
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth < 1024 && sidebarOpen) {
      setSidebarOpen(false);
    }
  };
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkUpcomingMeetings = () => {
      const today = new Date().toISOString().split('T')[0];
      const upcomingMeetingsToday = meetings.filter(meeting => {
        if (meeting.date !== today) return false;
        // Simple check if meeting time is in the future (could be more precise)
        const meetingDateTime = new Date(`${meeting.date}T${meeting.time}`);
        return meetingDateTime > new Date();
      });

      if (upcomingMeetingsToday.length > 0) {
        upcomingMeetingsToday.forEach(meeting => {
          const alreadyNotified = sessionStorage.getItem(`notified_meeting_${meeting.id}`);
          if (!alreadyNotified) {
            toast({
              title: "Upcoming Meeting Reminder",
              description: `You have a meeting: "${meeting.title}" today at ${meeting.time}.`,
              duration: 10000, 
            });
            sessionStorage.setItem(`notified_meeting_${meeting.id}`, 'true');
          }
        });
      }
    };

    // Check for meetings on initial load and then periodically (e.g., every 5 minutes)
    checkUpcomingMeetings();
    const intervalId = setInterval(checkUpcomingMeetings, 5 * 60 * 1000); 

    return () => clearInterval(intervalId);
  }, [meetings, toast]);
  
  return (
    <div className="flex h-screen bg-background text-foreground antialiased">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          toggleSidebar={toggleSidebar}
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          isSidebarOpen={sidebarOpen}
        />
        <MainContent currentPath={location.pathname}>
          {children}
        </MainContent>
      </div>
    </div>
  );
};

export default DashboardLayout;
