
import React from 'react';
import Layout from '../components/Layout';
import { useData } from '../context/DataContext';
import { format } from 'date-fns';
import Filters from '../components/Filters';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Expenditures: React.FC = () => {
  const { getFilteredExpenditures, getAssetById, bases } = useData();
  const expenditures = getFilteredExpenditures();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Asset Expenditures</h1>
        </div>
        
        <Filters />
        
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
      </div>
    </Layout>
  );
};

export default Expenditures;
