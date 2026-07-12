import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Play,
  Pause,
  Edit,
  Trash2,
  PlusCircle,
  User,
  Briefcase,
  CalendarDays,
  AlertTriangle,
  ClipboardList,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL;

const taskStatuses = [
  'Pending',
  'In Progress',
  'Completed',
  'Waiting for Client',
  'On Hold',
];
const taskPriorities = ['Low', 'Medium', 'High', 'Urgent'];

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const TaskForm = ({ taskData, onSubmit, onCancel, clients, users }) => {
  const [title, setTitle] = useState(taskData?.title || '');
  const [project, setProject] = useState(taskData?.project || '');
  const [assignedTo, setAssignedTo] = useState(
    taskData?.assigned_to ? String(taskData.assigned_to) : '',
  );
  const [priority, setPriority] = useState(taskData?.priority || 'Medium');
  const [status, setStatus] = useState(taskData?.status || 'Pending');
  const [dueDate, setDueDate] = useState(taskData?.dueDate || '');
  const [clientId, setClientId] = useState(taskData?.clientId || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      alert('Please provide a title for the task.');
      return;
    }
    onSubmit({
      id: taskData?.id,
      title,
      project,
      assigned_to: assignedTo ? Number(assignedTo) : null,
      priority,
      status,
      dueDate,
      clientId,
      timeTracked: taskData?.timeTracked || 0,
      timerRunning: taskData?.timerRunning || false,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 max-h-[70vh] overflow-y-auto p-1 custom-scrollbar">
      <div>
        <Label htmlFor="task-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Design homepage"
          required
        />
      </div>
      <div>
        <Label htmlFor="task-project">Project/Context</Label>
        <Input
          id="task-project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          placeholder="e.g., Website Redesign"
        />
      </div>
      <div>
        <Label htmlFor="task-assignedTo">Assigned To</Label>

        <Select value={assignedTo} onValueChange={setAssignedTo}>
          <SelectTrigger id="task-assignedTo">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>

          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={String(user.id)}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="task-priority">Priority</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger id="task-priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {taskPriorities.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="task-status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="task-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {taskStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="task-dueDate">Due Date</Label>
        <Input
          id="task-dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="task-clientId">Link to Client</Label>
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger id="task-clientId">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Client</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={String(client.id)}>
                {client.company_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">{taskData ? 'Update Task' : 'Add Task'}</Button>
      </DialogFooter>
    </form>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [internalComment, setInternalComment] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [now, setNow] = useState(Date.now());
  const { toast } = useToast();

  const getDisplayTime = (task) => {
    let total = Number(task.timeTracked || 0);

    if (task.timerRunning && task.timerStartedAt) {
      const started = new Date(task.timerStartedAt).getTime();
      total += Math.floor((now - started) / 1000);
    }

    return total;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadComments = async (taskId) => {
    const response = await fetch(
      `${API_BASE}/get-task-comments.php?task_id=${taskId}`,
    );

    const data = await response.json();
    if (response.ok) {
      setComments(data.comments);
    }
  };

  const openComments = async (task) => {
    setSelectedTask(task);
    await loadComments(task.id);
    setCommentsOpen(true);
  };

  const addComment = async () => {
    const stored = JSON.parse(localStorage.getItem('currentUser'));

    const currentUser = stored.value;

    const response = await fetch(`${API_BASE}/add-task-comment.php`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        task_id: selectedTask.id,

        user_id: currentUser.id,

        comment: newComment,

        is_internal: internalComment,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setNewComment('');

      await loadComments(selectedTask.id);
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              timerRunning:
                newStatus !== 'Completed' ? task.timerRunning : false,
            }
          : task,
      ),
    );
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/getUsers.php`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      setUsers(data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_BASE}/getClients.php`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch clients');
      }

      setClients(data.clients);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE}/get-tasks.php`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tasks');
      }

      setTasks(data.tasks);
    } catch (err) {
      console.error(err);

      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchClients();
    fetchTasks();
  }, []);

  const handleAddOrEditTask = async (taskData) => {
    try {
      const url = editingTask
        ? `${API_BASE}/update-task.php`
        : `${API_BASE}/add-task.php`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save task');
      }

      toast({
        title: editingTask ? 'Task Updated' : 'Task Added',
        description: editingTask
          ? `Task "${taskData.title}" updated.`
          : `Task "${taskData.title}" added.`,
      });

      // Refresh tasks from the database
      await fetchTasks();

      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const openModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE}/delete-task.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: taskId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete task');
      }

      toast({
        title: 'Task Deleted',
        description: 'Task deleted successfully.',
      });

      await fetchTasks();
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const getClientName = (clientId) => {
    if (!clientId) return 'N/A';
    const client = clients.find((c) => String(c.id) === String(clientId));
    return client ? client.company_name : 'Unknown Client';
  };

  const getUserName = (userId) => {
    const user = users.find((u) => String(u.id) === String(userId));

    return user ? user.name : 'N/A';
  };

  const toggleTimer = async (task) => {
    try {
      const stored = JSON.parse(localStorage.getItem('currentUser'));
      const currentUser = stored.value;
      const endpoint = task.timerRunning
        ? 'stop-task-timer.php'
        : 'start-task-timer.php';

      const payload = {
        id: task.id,
        user_id: currentUser.id,
      };

      console.log(payload);

      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // const response = await fetch(`${API_BASE}/${endpoint}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     id: task.id,
      //     user_id: currentUser.id,
      //   }),
      // });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Timer failed');
      }

      await fetchTasks();
    } catch (err) {
      toast({
        title: 'Timer Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Dialog
          open={isModalOpen}
          onOpenChange={(isOpen) => {
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
              <DialogTitle className="text-primary">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </DialogTitle>
              <DialogDescription>
                {editingTask
                  ? 'Update the task details.'
                  : 'Fill in the information for the new task.'}
              </DialogDescription>
            </DialogHeader>
            <TaskForm
              taskData={editingTask}
              onSubmit={handleAddOrEditTask}
              onCancel={() => {
                setIsModalOpen(false);
                setEditingTask(null);
              }}
              clients={clients}
              users={users}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Task Comments</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-3">
                  <div className="flex justify-between">
                    <div>
                      <strong>
                        {comment.admin_name || comment.company_name}
                      </strong>
                    </div>

                    <div>
                      {comment.is_internal ? (
                        <span className="text-orange-500">Internal</span>
                      ) : (
                        <span className="text-green-500">Client Visible</span>
                      )}
                    </div>
                  </div>

                  <p className="mt-2">{comment.comment}</p>

                  <div className="text-xs text-gray-500 mt-2">
                    {comment.created_at}
                  </div>
                </div>
              ))}
            </div>

            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="mt-4"
            />

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <input
                  id="internalComment"
                  type="checkbox"
                  checked={internalComment}
                  onChange={(e) => setInternalComment(e.target.checked)}
                  className="h-4 w-4"
                />

                <label htmlFor="internalComment" className="text-sm">
                  Internal Comment
                </label>
              </div>

              <Button onClick={addComment}>Post Comment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary">Task Management</CardTitle>
          <CardDescription>
            Keep track of all your tasks and their progress.
          </CardDescription>
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
                <TableRow
                  key={task.id}
                  className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-primary">
                    {task.title}
                  </TableCell>
                  <TableCell>{getClientName(task.clientId)}</TableCell>
                  <TableCell>{getUserName(task.assigned_to)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.priority === 'High' || task.priority === 'Urgent'
                          ? 'destructive'
                          : task.priority === 'Medium'
                            ? 'secondary'
                            : 'outline'
                      }
                      className={
                        task.priority === 'Urgent'
                          ? 'bg-red-600 text-white'
                          : task.priority === 'High'
                            ? 'bg-orange-500 text-white'
                            : task.priority === 'Medium'
                              ? 'bg-yellow-500 text-black'
                              : 'bg-slate-500 text-white'
                      }>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={task.status}
                      onValueChange={(value) =>
                        handleStatusChange(task.id, value)
                      }>
                      <SelectTrigger className="w-[150px] text-xs h-8">
                        <SelectValue placeholder="Set status" />
                      </SelectTrigger>
                      <SelectContent>
                        {taskStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{task.dueDate || 'N/A'}</TableCell>
                  <TableCell>{formatTime(getDisplayTime(task))}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleTimer(task)}
                      disabled={task.status === 'Completed'}>
                      {task.timerRunning ? (
                        <Pause className="h-5 w-5 text-red-500" />
                      ) : (
                        <Play className="h-5 w-5 text-green-500" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openModal(task)}
                      className="border-primary text-primary hover:bg-primary/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                      className="hover:bg-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => openComments(task)}>
                      💬 Comments
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
