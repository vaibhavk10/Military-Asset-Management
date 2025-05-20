
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Filters from '../components/Filters';
import { useData } from '../context/DataContext';
import { Transfer } from '../types';
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
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'In Transit':
      return 'bg-blue-100 text-blue-800';
    case 'Pending':
      return 'bg-amber-100 text-amber-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Transfers: React.FC = () => {
  const { user } = useAuth();
  const { assets, bases, getFilteredTransfers, getAssetById, addTransfer } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [filteredAssets, setFilteredAssets] = useState(assets);
  const [newTransfer, setNewTransfer] = useState<Omit<Transfer, 'id'>>({
    assetId: '',
    fromBaseId: user?.baseId || '',
    toBaseId: '',
    quantity: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'Pending',
    initiatedBy: user?.name || '',
  });
  
  const transfers = getFilteredTransfers();
  
  React.useEffect(() => {
    if (newTransfer.fromBaseId) {
      const baseAssets = assets.filter(asset => asset.baseId === newTransfer.fromBaseId);
      setFilteredAssets(baseAssets);
    }
  }, [newTransfer.fromBaseId, assets]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransfer({ ...newTransfer, [name]: name === 'quantity' ? parseInt(value) : value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === 'assetId') {
      setSelectedAsset(value);
      const asset = assets.find(a => a.id === value);
      if (asset) {
        setNewTransfer({ 
          ...newTransfer, 
          assetId: value,
          fromBaseId: asset.baseId
        });
      }
    } else {
      setNewTransfer({ ...newTransfer, [name]: value });
    }
  };
  
  const handleAddTransfer = () => {
    if (!newTransfer.assetId || !newTransfer.fromBaseId || !newTransfer.toBaseId || newTransfer.quantity <= 0) {
      toast.error('Please fill all required fields.');
      return;
    }
    
    const asset = assets.find(a => a.id === newTransfer.assetId);
    
    if (!asset) {
      toast.error('Selected asset not found.');
      return;
    }
    
    if (asset.quantity < newTransfer.quantity) {
      toast.error(`Insufficient quantity available. Maximum available: ${asset.quantity}`);
      return;
    }
    
    if (newTransfer.fromBaseId === newTransfer.toBaseId) {
      toast.error('Source and destination bases cannot be the same.');
      return;
    }
    
    addTransfer(newTransfer);
    toast.success('Transfer initiated successfully.');
    setIsAddDialogOpen(false);
    resetNewTransfer();
  };
  
  const resetNewTransfer = () => {
    setNewTransfer({
      assetId: '',
      fromBaseId: user?.baseId || '',
      toBaseId: '',
      quantity: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'Pending',
      initiatedBy: user?.name || '',
    });
    setSelectedAsset('');
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Asset Transfers</h1>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-military-accent hover:bg-military-primary">Initiate Transfer</Button>
        </div>
        
        <Filters />
        
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableCaption>List of all asset transfers</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>From Base</TableHead>
                <TableHead>To Base</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Initiated By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.length > 0 ? (
                transfers.map((transfer) => {
                  const asset = getAssetById(transfer.assetId);
                  const fromBase = bases.find(b => b.id === transfer.fromBaseId);
                  const toBase = bases.find(b => b.id === transfer.toBaseId);
                  
                  return (
                    <TableRow key={transfer.id}>
                      <TableCell>{asset?.name || 'Unknown Asset'}</TableCell>
                      <TableCell>{fromBase?.name || 'Unknown Base'}</TableCell>
                      <TableCell>{toBase?.name || 'Unknown Base'}</TableCell>
                      <TableCell>{transfer.quantity}</TableCell>
                      <TableCell>{format(new Date(transfer.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transfer.status)}>
                          {transfer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transfer.initiatedBy}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">No transfers found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Initiate Asset Transfer</DialogTitle>
              <DialogDescription>
                Enter the details for the new asset transfer.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assetId" className="text-right">Asset</Label>
                <Select
                  value={selectedAsset}
                  onValueChange={(value) => handleSelectChange('assetId', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAssets.map(asset => (
                      <SelectItem key={asset.id} value={asset.id}>{asset.name} ({asset.quantity} available)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fromBaseId" className="text-right">From Base</Label>
                <Select
                  value={newTransfer.fromBaseId}
                  onValueChange={(value) => handleSelectChange('fromBaseId', value)}
                  disabled={user && user.role !== 'Admin'}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select source base" />
                  </SelectTrigger>
                  <SelectContent>
                    {bases.map(base => (
                      <SelectItem key={base.id} value={base.id}>{base.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="toBaseId" className="text-right">To Base</Label>
                <Select
                  value={newTransfer.toBaseId}
                  onValueChange={(value) => handleSelectChange('toBaseId', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select destination base" />
                  </SelectTrigger>
                  <SelectContent>
                    {bases.filter(base => base.id !== newTransfer.fromBaseId).map(base => (
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
                  value={newTransfer.quantity}
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
                  value={newTransfer.date}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddTransfer} className="bg-military-accent hover:bg-military-primary">
                Initiate Transfer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Transfers;
