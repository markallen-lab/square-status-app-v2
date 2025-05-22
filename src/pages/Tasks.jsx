
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Play, Pause, Edit, Trash2, PlusCircle, User, Briefcase, CalendarDays, AlertTriangle, ClipboardList } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast";
import { useData } from '@/contexts/DataContext';


const taskStatuses = ['Pending', 'In Progress', 'Completed', 'Waiting for Client', 'On Hold'];
const taskPriorities = ['Low', 'Medium', 'High', 'Urgent'];

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};


const TaskForm = ({ taskData, onSubmit, onCancel, clients }) => {
  const [title, setTitle] = useState(taskData?.title || '');
  const [project, setProject] = useState(taskData?.project || '');
  const [assignedTo, setAssignedTo] = useState(taskData?.assignedTo || '');
  const [priority, setPriority] = useState(taskData?.priority || 'Medium');
  const [status, setStatus] = useState(taskData?.status || 'Pending');
  const [dueDate, setDueDate] = useState(taskData?.dueDate || '');
  const [clientId, setClientId] = useState(taskData?.clientId || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      alert("Please provide a title for the task.");
      return;
    }
    onSubmit({
      id: taskData?.id || uuidv4(),
      title,
      project,
      assignedTo,
      priority,
      status,
      dueDate,
      clientId,
      timeTracked: taskData?.timeTracked || 0,
      timerRunning: taskData?.timerRunning || false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto p-1 custom-scrollbar">
      <div>
        <Label htmlFor="task-title">Title <span className="text-destructive">*</span></Label>
        <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Design homepage" required />
      </div>
      <div>
        <Label htmlFor="task-project">Project/Context</Label>
        <Input id="task-project" value={project} onChange={(e) => setProject(e.target.value)} placeholder="e.g., Website Redesign" />
      </div>
      <div>
        <Label htmlFor="task-assignedTo">Assigned To</Label>
        <Input id="task-assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="e.g., John Doe" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="task-priority">Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger id="task-priority"><SelectValue placeholder="Select priority" /></SelectTrigger>
            <SelectContent>
              {taskPriorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="task-status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="task-status"><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {taskStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="task-dueDate">Due Date</Label>
        <Input id="task-dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="task-clientId">Link to Client</Label>
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger id="task-clientId"><SelectValue placeholder="Select a client" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {clients.map(client => (
              <SelectItem key={client.id} value={client.id}>{client.companyName || client.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="pt-4">
        <DialogClose asChild><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></DialogClose>
        <Button type="submit">{taskData ? 'Update Task' : 'Add Task'}</Button>
      </DialogFooter>
    </form>
  );
};


const Tasks = () => {
  const { tasks, setTasks, clients } = useData();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.timerRunning ? { ...task, timeTracked: task.timeTracked + 1 } : task
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [setTasks]);

  const toggleTimer = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, timerRunning: !task.timerRunning } : task
      )
    );
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus, timerRunning: newStatus !== 'Completed' ? task.timerRunning : false } : task
      )
    );
  };
  
  const handleAddOrEditTask = (taskData) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData} : t));
      toast({ title: "Task Updated", description: `Task "${taskData.title}" updated.` });
    } else {
      setTasks(prev => [...prev, taskData]);
      toast({ title: "Task Added", description: `Task "${taskData.title}" added.` });
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const openModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast({ title: "Task Deleted", description: `Task "${taskToDelete?.title}" deleted.`, variant: "destructive" });
  };
  
  const getClientName = (clientId) => {
    if (!clientId) return 'N/A';
    const client = clients.find(c => c.id === clientId);
    return client ? (client.companyName || client.name) : 'Unknown Client';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
         <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
          setIsModalOpen(isOpen);
          if (!isOpen) setEditingTask(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => openModal()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-primary">{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
              <DialogDescription>
                {editingTask ? 'Update the task details.' : 'Fill in the information for the new task.'}
              </DialogDescription>
            </DialogHeader>
            <TaskForm 
              taskData={editingTask} 
              onSubmit={handleAddOrEditTask} 
              onCancel={() => { setIsModalOpen(false); setEditingTask(null); }}
              clients={clients}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary">Task Management</CardTitle>
          <CardDescription>Keep track of all your tasks and their progress.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Time Tracked</TableHead>
                <TableHead className="text-center">Timer</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-primary">{task.title}</TableCell>
                  <TableCell>{getClientName(task.clientId)}</TableCell>
                  <TableCell>{task.assignedTo || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={task.priority === 'High' || task.priority === 'Urgent' ? 'destructive' : task.priority === 'Medium' ? 'secondary' : 'outline'}
                       className={
                        task.priority === 'Urgent' ? 'bg-red-600 text-white' :
                        task.priority === 'High' ? 'bg-orange-500 text-white' :
                        task.priority === 'Medium' ? 'bg-yellow-500 text-black' :
                        'bg-slate-500 text-white'
                      }
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select value={task.status} onValueChange={(value) => handleStatusChange(task.id, value)}>
                      <SelectTrigger className="w-[150px] text-xs h-8">
                        <SelectValue placeholder="Set status" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{task.dueDate || 'N/A'}</TableCell>
                  <TableCell>{formatTime(task.timeTracked)}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" onClick={() => toggleTimer(task.id)} disabled={task.status === 'Completed'}>
                      {task.timerRunning ? <Pause className="h-5 w-5 text-red-500" /> : <Play className="h-5 w-5 text-green-500" />}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="outline" size="icon" onClick={() => openModal(task)} className="border-primary text-primary hover:bg-primary/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteTask(task.id)} className="hover:bg-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {tasks.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <ClipboardList className="mx-auto h-12 w-12 mb-2" />
              <p>No tasks found. Click "Add New Task" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Tasks;
