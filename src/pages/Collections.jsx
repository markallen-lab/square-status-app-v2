
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter as DialogFooterPrimitive, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Users, FileText, TrendingDown, PlusCircle, Edit, Trash2, Package, ShoppingCart, Wrench as Tool, Landmark } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

const FinanceStatCard = ({ title, value, icon, description, currencySymbol }) => (
  <Card className="shadow-sm bg-card border-border">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-card-foreground">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-primary">{currencySymbol}{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const ExpenseForm = ({ expenseData, onSubmit, onCancel }) => {
  const [description, setDescription] = useState(expenseData?.description || '');
  const [amount, setAmount] = useState(expenseData?.amount || '');
  const [date, setDate] = useState(expenseData?.date || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(expenseData?.category || 'Software');

  const expenseCategories = ['Software', 'Hardware', 'Marketing', 'Utilities', 'Office Supplies', 'Travel', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !date || !category) {
      alert("Please fill in all fields for the expense.");
      return;
    }
    onSubmit({
      id: expenseData?.id || `exp_${uuidv4()}`,
      description,
      amount: parseFloat(amount),
      date,
      category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto p-1 custom-scrollbar">
      <div>
        <Label htmlFor="exp-description">Description <span className="text-destructive">*</span></Label>
        <Input id="exp-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Monthly Adobe Subscription" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="exp-amount">Amount <span className="text-destructive">*</span></Label>
          <Input id="exp-amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 59.99" required />
        </div>
        <div>
          <Label htmlFor="exp-date">Date <span className="text-destructive">*</span></Label>
          <Input id="exp-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
      </div>
      <div>
        <Label htmlFor="exp-category">Category <span className="text-destructive">*</span></Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="exp-category"><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {expenseCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <DialogFooterPrimitive className="pt-4">
        <DialogClose asChild><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button></DialogClose>
        <Button type="submit">{expenseData ? 'Update Expense' : 'Add Expense'}</Button>
      </DialogFooterPrimitive>
    </form>
  );
};


const Collections = () => {
  const { clients, packages, expenses, setExpenses } = useData();
  const { currency } = useSettings();
  const { toast } = useToast();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const totalHostingFees = clients.reduce((sum, client) => {
    const pkg = packages.find(p => p.id === client.packageId);
    return sum + (pkg ? pkg.price : 0);
  }, 0);

  const monthlyIncome = totalHostingFees; // Simplified for now, can be expanded
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const overdueInvoices = 0; // Placeholder

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netIncome = monthlyIncome - totalExpenses;

  const handleAddOrEditExpense = (expenseData) => {
    if (editingExpense) {
      setExpenses(prev => prev.map(e => e.id === editingExpense.id ? expenseData : e));
      toast({ title: "Expense Updated", description: `${expenseData.description} updated.` });
    } else {
      setExpenses(prev => [...prev, expenseData]);
      toast({ title: "Expense Added", description: `${expenseData.description} added.` });
    }
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const openExpenseModal = (expense = null) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleDeleteExpense = (expenseId) => {
    const expenseToDelete = expenses.find(e => e.id === expenseId);
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
    toast({ title: "Expense Deleted", description: `${expenseToDelete?.description} deleted.`, variant: "destructive" });
  };
  
  const getExpenseCategoryIcon = (category) => {
    switch (category) {
      case 'Software': return <Package className="h-4 w-4 text-muted-foreground" />;
      case 'Hardware': return <ShoppingCart className="h-4 w-4 text-muted-foreground" />;
      case 'Marketing': return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
      case 'Utilities': return <Tool className="h-4 w-4 text-muted-foreground" />;
      default: return <DollarSign className="h-4 w-4 text-muted-foreground" />;
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Finance Overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <FinanceStatCard
          title="Monthly Hosting Fees"
          value={totalHostingFees.toFixed(2)}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="Collectible hosting fees this month"
          currencySymbol={currency.symbol}
        />
        <FinanceStatCard
          title="Total Monthly Income"
          value={monthlyIncome.toFixed(2)}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="Gross income from all services"
          currencySymbol={currency.symbol}
        />
        <FinanceStatCard
          title="Total Monthly Expenses"
          value={totalExpenses.toFixed(2)}
          icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
          description="Sum of all recorded expenses"
          currencySymbol={currency.symbol}
        />
        <FinanceStatCard
          title="Net Monthly Income"
          value={netIncome.toFixed(2)}
          icon={<Landmark className="h-4 w-4 text-muted-foreground" />}
          description="Income after expenses"
          currencySymbol={currency.symbol}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-primary">Income Breakdown</CardTitle>
              <CardDescription>Overview of income sources.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {/* Placeholder for income details */}
            <div className="h-48 flex items-center justify-center bg-muted/50 rounded-md">
              <p className="text-muted-foreground">Detailed income table/chart coming soon.</p>
            </div>
            <img  class="mt-4 w-full h-auto rounded-md object-cover" alt="Vibrant abstract representation of financial growth and income streams" src="https://images.unsplash.com/photo-1500401519266-0b71b29a05e0" />
          </CardContent>
        </Card>

        <Card className="shadow-md bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-primary">Monthly Expenses</CardTitle>
              <CardDescription>Track and manage your business expenses.</CardDescription>
            </div>
            <Dialog open={isExpenseModalOpen} onOpenChange={(isOpen) => {
              setIsExpenseModalOpen(isOpen);
              if (!isOpen) setEditingExpense(null);
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => openExpenseModal()}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-primary">{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
                </DialogHeader>
                <ExpenseForm 
                  expenseData={editingExpense} 
                  onSubmit={handleAddOrEditExpense} 
                  onCancel={() => { setIsExpenseModalOpen(false); setEditingExpense(null); }}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((exp) => (
                    <TableRow key={exp.id} className="border-border hover:bg-muted/50">
                      <TableCell className="font-medium text-card-foreground">{exp.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground border-border">
                          {getExpenseCategoryIcon(exp.category)}
                          {exp.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{exp.date}</TableCell>
                      <TableCell className="text-right text-card-foreground">{currency.symbol}{exp.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="outline" size="icon" onClick={() => openExpenseModal(exp)} className="border-primary text-primary hover:bg-primary/10 h-8 w-8">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteExpense(exp.id)} className="hover:bg-destructive/80 h-8 w-8">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center bg-muted/50 rounded-md">
                <TrendingDown className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No expenses recorded yet.</p>
                <p className="text-xs text-muted-foreground">Click "Add Expense" to start tracking.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Collections;
