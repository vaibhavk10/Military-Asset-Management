
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Filters from '../components/Filters';
import { useData } from '../context/DataContext';
import { Assignment } from '../types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Expenditure } from '../types';

const Assignments: React.FC = () => {
  const { user } = useAuth();
  const { assets, bases, getFilteredAssignments, getFilteredExpenditures, getAssetById, addAssignment, addExpenditure } = useData();
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [isAddExpenditureOpen, setIsAddExpenditureOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedExpenditureAsset, setSelectedExpenditureAsset] = useState('');
  const [filteredAssets, setFilteredAssets] = useState(assets);
  const [newAssignment, setNewAssignment] = useState<Omit<Assignment, 'id'>>({
    assetId: '',
    personnelId: '',
    quantity: 0,
    baseId: user?.baseId || '',
    assignmentDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [newExpenditure, setNewExpenditure] = useState<Omit<Expenditure, 'id'>>({
    assetId: '',
    quantity: 0,
    baseId: user?.baseId || '',
    date: format(new Date(), 'yyyy-MM-dd'),
    reason: '',
  });
  
  const assignments = getFilteredAssignments();
  const expenditures = getFilteredExpenditures();
  
  React.useEffect(() => {
    if (user && user.baseId) {
      const baseAssets = assets.filter(asset => asset.baseId === user.baseId);
      setFilteredAssets(baseAssets);
    } else {
      setFilteredAssets(assets);
    }
  }, [assets, user]);
  
  const handleAssignmentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: name === 'quantity' ? parseInt(value) : value });
  };
  
  const handleExpenditureInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExpenditure({ ...newExpenditure, [name]: name === 'quantity' ? parseInt(value) : value });
  };
  
  const handleSelectChange = (type: 'assignment' | 'expenditure', name: string, value: string) => {
    if (type === 'assignment') {
      if (name === 'assetId') {
        setSelectedAsset(value);
        setNewAssignment({ ...newAssignment, assetId: value });
      } else {
        setNewAssignment({ ...newAssignment, [name]: value });
      }
    } else {
      if (name === 'assetId') {
        setSelectedExpenditureAsset(value);
        setNewExpenditure({ ...newExpenditure, assetId: value });
      } else {
        setNewExpenditure({ ...newExpenditure, [name]: value });
      }
    }
  };
  
  const handleAddAssignment = () => {
    if (!newAssignment.assetId || !newAssignment.personnelId || !newAssignment.baseId || newAssignment.quantity <= 0) {
      toast.error('Please fill all required fields.');
      return;
    }
    
    const asset = assets.find(a => a.id === newAssignment.assetId);
    
    if (!asset) {
      toast.error('Selected asset not found.');
      return;
    }
    
    if (asset.quantity < newAssignment.quantity) {
      toast.error(`Insufficient quantity available. Maximum available: ${asset.quantity}`);
      return;
    }
    
    addAssignment(newAssignment);
    toast.success('Assignment added successfully.');
    setIsAddAssignmentOpen(false);
    resetNewAssignment();
  };
  
  const handleAddExpenditure = () => {
    if (!newExpenditure.assetId || !newExpenditure.baseId || !newExpenditure.reason || newExpenditure.quantity <= 0) {
      toast.error('Please fill all required fields.');
      return;
    }
    
    const asset = assets.find(a => a.id === newExpenditure.assetId);
    
    if (!asset) {
      toast.error('Selected asset not found.');
      return;
    }
    
    if (asset.quantity < newExpenditure.quantity) {
      toast.error(`Insufficient quantity available. Maximum available: ${asset.quantity}`);
      return;
    }
    
    addExpenditure(newExpenditure);
    toast.success('Expenditure recorded successfully.');
    setIsAddExpenditureOpen(false);
    resetNewExpenditure();
  };
  
  const resetNewAssignment = () => {
    setNewAssignment({
      assetId: '',
      personnelId: '',
      quantity: 0,
      baseId: user?.baseId || '',
      assignmentDate: format(new Date(), 'yyyy-MM-dd'),
    });
    setSelectedAsset('');
  };
  
  const resetNewExpenditure = () => {
    setNewExpenditure({
      assetId: '',
      quantity: 0,
      baseId: user?.baseId || '',
      date: format(new Date(), 'yyyy-MM-dd'),
      reason: '',
    });
    setSelectedExpenditureAsset('');
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Assignments & Expenditures</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddAssignmentOpen(true)} className="bg-military-accent hover:bg-military-primary">
              Assign Assets
            </Button>
            <Button onClick={() => setIsAddExpenditureOpen(true)} variant="outline">
              Record Expenditure
            </Button>
          </div>
        </div>
        
        <Filters />
        
        <Tabs defaultValue="assignments" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="assignments" className="flex-1">Assignments</TabsTrigger>
            <TabsTrigger value="expenditures" className="flex-1">Expenditures</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assignments">
            <div className="bg-white rounded-lg shadow">
              <Table>
                <TableCaption>List of all asset assignments</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Personnel ID</TableHead>
                    <TableHead>Base</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Assignment Date</TableHead>
                    <TableHead>Return Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.length > 0 ? (
                    assignments.map((assignment) => {
                      const asset = getAssetById(assignment.assetId);
                      const base = bases.find(b => b.id === assignment.baseId);
                      
                      return (
                        <TableRow key={assignment.id}>
                          <TableCell>{asset?.name || 'Unknown Asset'}</TableCell>
                          <TableCell>{assignment.personnelId}</TableCell>
                          <TableCell>{base?.name || 'Unknown Base'}</TableCell>
                          <TableCell>{assignment.quantity}</TableCell>
                          <TableCell>{format(new Date(assignment.assignmentDate), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>
                            {assignment.returnDate 
                              ? format(new Date(assignment.returnDate), 'MMM dd, yyyy')
                              : 'Not returned'
                            }
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">No assignments found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="expenditures">
            <div className="bg-white rounded-lg shadow">
              <Table>
                <TableCaption>List of all asset expenditures</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Base</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenditures.length > 0 ? (
                    expenditures.map((expenditure) => {
                      const asset = getAssetById(expenditure.assetId);
                      const base = bases.find(b => b.id === expenditure.baseId);
                      
                      return (
                        <TableRow key={expenditure.id}>
                          <TableCell>{asset?.name || 'Unknown Asset'}</TableCell>
                          <TableCell>{base?.name || 'Unknown Base'}</TableCell>
                          <TableCell>{expenditure.quantity}</TableCell>
                          <TableCell>{format(new Date(expenditure.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{expenditure.reason}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">No expenditures found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Assignment Dialog */}
        <Dialog open={isAddAssignmentOpen} onOpenChange={setIsAddAssignmentOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Assets</DialogTitle>
              <DialogDescription>
                Enter the details for the asset assignment.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assetId" className="text-right">Asset</Label>
                <Select
                  value={selectedAsset}
                  onValueChange={(value) => handleSelectChange('assignment', 'assetId', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAssets.filter(asset => asset.quantity > 0).map(asset => (
                      <SelectItem key={asset.id} value={asset.id}>{asset.name} ({asset.quantity} available)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="personnelId" className="text-right">Personnel ID</Label>
                <Input
                  id="personnelId"
                  name="personnelId"
                  value={newAssignment.personnelId}
                  onChange={handleAssignmentInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="baseId" className="text-right">Base</Label>
                <Select
                  value={newAssignment.baseId}
                  onValueChange={(value) => handleSelectChange('assignment', 'baseId', value)}
                  disabled={user && user.role !== 'Admin'}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select base" />
                  </SelectTrigger>
                  <SelectContent>
                    {bases.map(base => (
                      <SelectItem key={base.id} value={base.id}>{base.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={newAssignment.quantity}
                  onChange={handleAssignmentInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignmentDate" className="text-right">Assignment Date</Label>
                <Input
                  id="assignmentDate"
                  name="assignmentDate"
                  type="date"
                  value={newAssignment.assignmentDate}
                  onChange={handleAssignmentInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddAssignmentOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddAssignment} className="bg-military-accent hover:bg-military-primary">
                Assign Asset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Expenditure Dialog */}
        <Dialog open={isAddExpenditureOpen} onOpenChange={setIsAddExpenditureOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Record Expenditure</DialogTitle>
              <DialogDescription>
                Enter the details for the asset expenditure.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expAssetId" className="text-right">Asset</Label>
                <Select
                  value={selectedExpenditureAsset}
                  onValueChange={(value) => handleSelectChange('expenditure', 'assetId', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAssets.filter(asset => asset.quantity > 0).map(asset => (
                      <SelectItem key={asset.id} value={asset.id}>{asset.name} ({asset.quantity} available)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expBaseId" className="text-right">Base</Label>
                <Select
                  value={newExpenditure.baseId}
                  onValueChange={(value) => handleSelectChange('expenditure', 'baseId', value)}
                  disabled={user && user.role !== 'Admin'}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select base" />
                  </SelectTrigger>
                  <SelectContent>
                    {bases.map(base => (
                      <SelectItem key={base.id} value={base.id}>{base.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expQuantity" className="text-right">Quantity</Label>
                <Input
                  id="expQuantity"
                  name="quantity"
                  type="number"
                  value={newExpenditure.quantity}
                  onChange={handleExpenditureInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expDate" className="text-right">Date</Label>
                <Input
                  id="expDate"
                  name="date"
                  type="date"
                  value={newExpenditure.date}
                  onChange={handleExpenditureInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">Reason</Label>
                <Input
                  id="reason"
                  name="reason"
                  value={newExpenditure.reason}
                  onChange={handleExpenditureInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddExpenditureOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddExpenditure} className="bg-military-accent hover:bg-military-primary">
                Record Expenditure
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Assignments;
