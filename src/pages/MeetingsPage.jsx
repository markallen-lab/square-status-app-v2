
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter as DialogFooterPrimitive, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, CalendarDays, Clock, Users, AlignLeft, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { cn } from "@/lib/utils";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const MeetingForm = ({ meetingData, onSubmit, onCancel, clients }) => {
  const [title, setTitle] = useState(meetingData?.title || '');
  const [date, setDate] = useState(meetingData?.date || '');
  const [time, setTime] = useState(meetingData?.time || '');
  const [participants, setParticipants] = useState(meetingData?.participants || '');
  const [description, setDescription] = useState(meetingData?.description || '');
  const [clientIds, setClientIds] = useState(meetingData?.clientIds || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !time) {
      alert("Please fill in Title, Date, and Time for the meeting.");
      return;
    }
    onSubmit({
      id: meetingData?.id || `meet_${uuidv4()}`,
      title,
      date,
      time,
      participants,
      description,
      clientIds
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 custom-scrollbar">
      <div>
        <Label htmlFor="meet-title">Title <span className="text-destructive">*</span></Label>
        <Input id="meet-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Project Update" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="meet-date">Date <span className="text-destructive">*</span></Label>
          <Input id="meet-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="meet-time">Time <span className="text-destructive">*</span></Label>
          <Input id="meet-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
      </div>
      <div>
        <Label htmlFor="meet-participants">Participants</Label>
        <Input id="meet-participants" value={participants} onChange={(e) => setParticipants(e.target.value)} placeholder="e.g., John Doe, Team Alpha" />
      </div>
      <div>
        <Label htmlFor="meet-clients">Link to Clients</Label>
        <Select onValueChange={setClientIds} value={clientIds}>
          <SelectTrigger id="meet-clients">
             <SelectValue placeholder="Select clients (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
                <SelectLabel>Clients</SelectLabel>
                {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>{client.companyName || client.name}</SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">This select component does not natively support multi-select in this ShadCN version. Consider using checkboxes or a custom multi-select for multiple client linking.</p>
      </div>
      <div>
        <Label htmlFor="meet-description">Description</Label>
        <Textarea id="meet-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Meeting agenda, notes, etc." />
      </div>
      <DialogFooterPrimitive className="pt-4">
        <DialogClose asChild><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></DialogClose>
        <Button type="submit">{meetingData?.id ? 'Update Meeting' : 'Add Meeting'}</Button>
      </DialogFooterPrimitive>
    </form>
  );
};

const CalendarView = ({ meetings, onDateClick, currentMonth, setCurrentMonth }) => {
  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); 

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const getMeetingsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return meetings.filter(m => m.date === dateString);
  };

  return (
    <Card className="shadow-md bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-primary">{monthNames[month]} {year}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-sm text-muted-foreground">
          {dayNames.map(day => <div key={day} className="font-medium">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="border border-transparent rounded-md"></div>)}
          {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
            const day = dayIndex + 1;
            const currentDateObj = new Date(year, month, day);
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            const meetingsOnDate = getMeetingsForDate(currentDateObj);
            
            return (
              <div
                key={day}
                onClick={() => onDateClick(currentDateObj)}
                className={cn(
                  "p-2 border rounded-md cursor-pointer aspect-square flex flex-col items-center justify-center transition-colors",
                  isToday ? "bg-primary/20 border-primary" : "border-border hover:bg-accent",
                  meetingsOnDate.length > 0 && "bg-sky-500/10 border-sky-500/50"
                )}
              >
                <span className={cn("font-medium", isToday && "text-primary")}>{day}</span>
                {meetingsOnDate.length > 0 && (
                  <div className="mt-1 text-xs text-sky-600 dark:text-sky-400">{meetingsOnDate.length}</div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};


const MeetingsPage = () => {
  const { meetings, setMeetings, clients } = useData();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleAddOrEditMeeting = (meetingData) => {
    if (editingMeeting?.id) {
      setMeetings(prev => prev.map(m => m.id === editingMeeting.id ? meetingData : m));
      toast({ title: "Meeting Updated", description: `${meetingData.title} has been updated.` });
    } else {
      setMeetings(prev => [...prev, meetingData]);
      toast({ title: "Meeting Added", description: `${meetingData.title} has been scheduled.` });
    }
    setIsModalOpen(false);
    setEditingMeeting(null);
  };

  const openModal = (meeting = null) => {
    if (meeting) {
      setEditingMeeting(meeting);
    } else {
       // For new meeting, prefill date if selectedDate is available
      const initialDate = selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      setEditingMeeting({ date: initialDate, clientIds: [] });
    }
    setIsModalOpen(true);
  };

  const handleDeleteMeeting = (meetingId) => {
    const meetingToDelete = meetings.find(m => m.id === meetingId);
    setMeetings(prev => prev.filter(m => m.id !== meetingId));
    toast({ title: "Meeting Deleted", description: `${meetingToDelete?.title} has been deleted.`, variant: "destructive" });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };
  
  const filteredMeetings = useMemo(() => {
    if (!selectedDate) return meetings;
    const dateString = selectedDate.toISOString().split('T')[0];
    return meetings.filter(m => m.date === dateString).sort((a,b) => a.time.localeCompare(b.time));
  }, [meetings, selectedDate]);
  
  const getClientNamesForMeeting = (clientIdsArray) => {
    if (!clientIdsArray || clientIdsArray.length === 0) return 'N/A';
    return clientIdsArray.map(id => {
        const client = clients.find(c => c.id === id);
        return client ? (client.companyName || client.name) : 'Unknown Client';
    }).join(', ');
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Meetings & Appointments</h1>
            <p className="text-muted-foreground">Manage your schedule and client meetings.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
          setIsModalOpen(isOpen);
          if (!isOpen) setEditingMeeting(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Schedule New Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-primary">{editingMeeting?.id ? 'Edit Meeting' : 'Schedule New Meeting'}</DialogTitle>
            </DialogHeader>
            <MeetingForm 
              meetingData={editingMeeting} 
              onSubmit={handleAddOrEditMeeting} 
              onCancel={() => { setIsModalOpen(false); setEditingMeeting(null); }}
              clients={clients}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarView meetings={meetings} onDateClick={handleDateClick} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
        </div>
        
        <Card className="shadow-md bg-card border-border lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-primary">
              Meetings for {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Today'}
            </CardTitle>
            <CardDescription>Upcoming appointments for the selected day.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {filteredMeetings.length > 0 ? filteredMeetings.map(meeting => (
              <motion.div 
                key={meeting.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg border border-border/70 bg-background/50 hover:bg-muted/50 transition-colors"
              >
                <h4 className="font-semibold text-card-foreground">{meeting.title}</h4>
                <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                  <p className="flex items-center"><Clock size={12} className="mr-1.5"/> {meeting.time} </p>
                  <p className="flex items-center"><Users size={12} className="mr-1.5"/> Participants: {meeting.participants || 'N/A'}</p>
                  {meeting.clientIds && meeting.clientIds.length > 0 && 
                    <p className="flex items-center"><Briefcase size={12} className="mr-1.5"/> Clients: {getClientNamesForMeeting(meeting.clientIds)}</p>
                  }
                  {meeting.description && <p className="flex items-start pt-1"><AlignLeft size={12} className="mr-1.5 mt-0.5 flex-shrink-0"/> {meeting.description}</p>}
                </div>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openModal(meeting)} className="h-7 px-2 text-xs">
                    <Edit size={12} className="mr-1"/> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteMeeting(meeting.id)} className="h-7 px-2 text-xs">
                    <Trash2 size={12} className="mr-1"/> Delete
                  </Button>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-10 text-muted-foreground">
                <CalendarDays className="mx-auto h-12 w-12 mb-2" />
                <p>No meetings scheduled for this day.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <img  alt="Modern abstract art representing calendar and scheduling" class="w-full max-w-2xl mx-auto h-auto rounded-lg shadow-lg mt-6" src="https://images.unsplash.com/photo-1541848980489-5719ac353a10" />
    </motion.div>
  );
};

export default MeetingsPage;
