
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Filters from '../components/Filters';
import { useData } from '../context/DataContext';
import { Purchase, EquipmentType } from '../types';
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
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Purchases: React.FC = () => {
  const { bases, getFilteredPurchases, addPurchase } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPurchase, setNewPurchase] = useState<Omit<Purchase, 'id'>>({
    assetName: '',
    type: 'Weapon',
    quantity: 0,
    baseId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    cost: 0,
    supplier: '',
  });
  
  const purchases = getFilteredPurchases();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPurchase({ ...newPurchase, [name]: name === 'quantity' || name === 'cost' ? parseInt(value) : value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewPurchase({ ...newPurchase, [name]: value });
  };
  
  const handleAddPurchase = () => {
    if (!newPurchase.assetName || !newPurchase.baseId || newPurchase.quantity <= 0) {
      toast.error('Please fill all required fields.');
      return;
    }
    
    addPurchase(newPurchase);
    toast.success('Purchase added successfully.');
    setIsAddDialogOpen(false);
    resetNewPurchase();
  };
  
  const resetNewPurchase = () => {
    setNewPurchase({
      assetName: '',
      type: 'Weapon',
      quantity: 0,
      baseId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      cost: 0,
      supplier: '',
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Asset Purchases</h1>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-military-accent hover:bg-military-primary">Add Purchase</Button>
        </div>
        
        <Filters />
        
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableCaption>List of all asset purchases</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Base</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Supplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.length > 0 ? (
                purchases.map((purchase) => {
                  const base = bases.find(b => b.id === purchase.baseId);
                  return (
                    <TableRow key={purchase.id}>
                      <TableCell>{purchase.assetName}</TableCell>
                      <TableCell>{purchase.type}</TableCell>
                      <TableCell>{base?.name || 'Unknown Base'}</TableCell>
                      <TableCell>{purchase.quantity}</TableCell>
                      <TableCell>{format(new Date(purchase.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>${purchase.cost.toLocaleString()}</TableCell>
                      <TableCell>{purchase.supplier}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">No purchases found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Purchase</DialogTitle>
              <DialogDescription>
                Enter the details for the new asset purchase.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assetName" className="text-right">Asset Name</Label>
                <Input
                  id="assetName"
                  name="assetName"
                  value={newPurchase.assetName}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select
                  value={newPurchase.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weapon">Weapon</SelectItem>
                    <SelectItem value="Vehicle">Vehicle</SelectItem>
                    <SelectItem value="Ammunition">Ammunition</SelectItem>
                    <SelectItem value="Communication">Communication</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="baseId" className="text-right">Base</Label>
                <Select
                  value={newPurchase.baseId}
                  onValueChange={(value) => handleSelectChange('baseId', value)}
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
                  value={newPurchase.quantity}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newPurchase.date}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cost" className="text-right">Cost</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  value={newPurchase.cost}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplier" className="text-right">Supplier</Label>
                <Input
                  id="supplier"
                  name="supplier"
                  value={newPurchase.supplier}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddPurchase} className="bg-military-accent hover:bg-military-primary">
                Add Purchase
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Purchases;
