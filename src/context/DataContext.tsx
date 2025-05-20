
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Base, Asset, Purchase, Transfer, Assignment, Filters, EquipmentType, Expenditure } from '../types';
import { bases, assets, purchases, transfers, assignments, expenditures, users } from '../data/mockData';
import { format } from 'date-fns';

interface DataContextProps {
  bases: Base[];
  assets: Asset[];
  purchases: Purchase[];
  transfers: Transfer[];
  assignments: Assignment[];
  expenditures: Expenditure[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  getAssetById: (id: string) => Asset | undefined;
  getFilteredAssets: () => Asset[];
  getFilteredPurchases: () => Purchase[];
  getFilteredTransfers: () => Transfer[];
  getFilteredAssignments: () => Assignment[];
  getFilteredExpenditures: () => Expenditure[];
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  addBase: (base: Omit<Base, 'id'>) => void;
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  addTransfer: (transfer: Omit<Transfer, 'id'>) => void;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  addExpenditure: (expenditure: Omit<Expenditure, 'id'>) => void;
  users: any[]; // Adding users property to fix the error in Settings.tsx
  getAssetMetrics: () => AssetMetrics; // Add this missing function type
}

// Add AssetMetrics interface to define the structure returned by getAssetMetrics
interface AssetMetrics {
  openingBalance: number;
  netMovement: number;
  assigned: number;
  closingBalance: number;
  purchases: number;
  transfersIn: number;
  transfersOut: number;
  expenditures: number;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [basesList, setBases] = useState<Base[]>(bases);
  const [assetsList, setAssets] = useState<Asset[]>(assets);
  const [purchasesList, setPurchases] = useState<Purchase[]>(purchases);
  const [transfersList, setTransfers] = useState<Transfer[]>(transfers);
  const [assignmentsList, setAssignments] = useState<Assignment[]>(assignments);
  const [expendituresList, setExpenditures] = useState<Expenditure[]>(expenditures);
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    // Simulate fetching data from local storage or an API
    const storedBases = localStorage.getItem('bases');
    const storedAssets = localStorage.getItem('assets');
    const storedPurchases = localStorage.getItem('purchases');
    const storedTransfers = localStorage.getItem('transfers');
    const storedAssignments = localStorage.getItem('assignments');
    const storedExpenditures = localStorage.getItem('expenditures');

    if (storedBases) setBases(JSON.parse(storedBases));
    if (storedAssets) setAssets(JSON.parse(storedAssets));
    if (storedPurchases) setPurchases(JSON.parse(storedPurchases));
    if (storedTransfers) setTransfers(JSON.parse(storedTransfers));
    if (storedAssignments) setAssignments(JSON.parse(storedAssignments));
    if (storedExpenditures) setExpenditures(JSON.parse(storedExpenditures));
  }, []);

  useEffect(() => {
    // Simulate saving data to local storage or an API
    localStorage.setItem('bases', JSON.stringify(basesList));
    localStorage.setItem('assets', JSON.stringify(assetsList));
    localStorage.setItem('purchases', JSON.stringify(purchasesList));
    localStorage.setItem('transfers', JSON.stringify(transfersList));
    localStorage.setItem('assignments', JSON.stringify(assignmentsList));
    localStorage.setItem('expenditures', JSON.stringify(expendituresList));
  }, [basesList, assetsList, purchasesList, transfersList, assignmentsList, expendituresList]);

  const getAssetById = (id: string) => assetsList.find(asset => asset.id === id);

  const filterItem = (item: any): boolean => {
    if (filters.date) {
      const itemDate = item.date ? new Date(item.date) : null;
      if (itemDate && filters.date.startDate && filters.date.endDate) {
        const startDate = new Date(filters.date.startDate);
        const endDate = new Date(filters.date.endDate);
        if (itemDate < startDate || itemDate > endDate) {
          return false;
        }
      }
    }
    if (filters.baseId && item.baseId !== filters.baseId) {
      return false;
    }
    if (filters.equipmentType && item.type !== filters.equipmentType) {
      return false;
    }
    return true;
  };

  const getFilteredAssets = () => assetsList.filter(filterItem);
  const getFilteredPurchases = () => purchasesList.filter(filterItem);
  const getFilteredTransfers = () => transfersList.filter(filterItem);
  const getFilteredAssignments = () => assignmentsList.filter(item => filterItem({
    ...item,
    date: item.assignmentDate // Map assignmentDate to date for filtering purposes
  }));
  const getFilteredExpenditures = () => expendituresList.filter(item => filterItem(item));

  // Implement getAssetMetrics function that was missing
  const getAssetMetrics = (): AssetMetrics => {
    // Calculate totals for purchases
    const totalPurchases = purchasesList.reduce((total, purchase) => total + purchase.quantity, 0);
    
    // Calculate transfers in and out
    const transfersIn = transfersList
      .filter(transfer => filters.baseId ? transfer.toBaseId === filters.baseId : true)
      .reduce((total, transfer) => total + transfer.quantity, 0);
      
    const transfersOut = transfersList
      .filter(transfer => filters.baseId ? transfer.fromBaseId === filters.baseId : true)
      .reduce((total, transfer) => total + transfer.quantity, 0);
    
    // Calculate assigned assets
    const assigned = assignmentsList.reduce((total, assignment) => total + assignment.quantity, 0);
    
    // Calculate expended assets
    const totalExpenditures = expendituresList.reduce((total, expenditure) => total + expenditure.quantity, 0);
    
    // Calculate net movement
    const netMovement = totalPurchases + transfersIn - transfersOut - totalExpenditures;
    
    // Opening and closing balance logic - simplified for now
    const openingBalance = assetsList.reduce((total, asset) => total + asset.quantity, 0) - netMovement;
    const closingBalance = openingBalance + netMovement;
    
    return {
      openingBalance,
      netMovement,
      assigned,
      closingBalance,
      purchases: totalPurchases,
      transfersIn,
      transfersOut,
      expenditures: totalExpenditures
    };
  };

  const addAsset = (asset: Omit<Asset, 'id'>) => {
    const newAsset: Asset = {
      id: Math.random().toString(36).substring(2, 15),
      ...asset,
    };
    setAssets([...assetsList, newAsset]);
  };

  const addBase = (base: Omit<Base, 'id'>) => {
    const newBase: Base = {
      id: Math.random().toString(36).substring(2, 15),
      ...base,
    };
    setBases([...basesList, newBase]);
  };

  const addPurchase = (purchase: Omit<Purchase, 'id'>) => {
    const newPurchase: Purchase = {
      id: Math.random().toString(36).substring(2, 15),
      ...purchase,
    };
    setPurchases([...purchasesList, newPurchase]);
  };

  const addTransfer = (transfer: Omit<Transfer, 'id'>) => {
    const newTransfer: Transfer = {
      id: Math.random().toString(36).substring(2, 15),
      ...transfer,
    };

    // Update asset quantities
    setAssets(prevAssets => {
      return prevAssets.map(asset => {
        if (asset.id === transfer.assetId) {
          return { ...asset, quantity: asset.quantity - transfer.quantity };
        } else {
          return asset;
        }
      });
    });

    setTransfers([...transfersList, newTransfer]);
  };

  const addAssignment = (assignment: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = {
      id: Math.random().toString(36).substring(2, 15),
      ...assignment,
    };

    // Update asset quantities
    setAssets(prevAssets => {
      return prevAssets.map(asset => {
        if (asset.id === assignment.assetId) {
          return { ...asset, quantity: asset.quantity - assignment.quantity };
        } else {
          return asset;
        }
      });
    });

    setAssignments([...assignmentsList, newAssignment]);
  };

  const addExpenditure = (expenditure: Omit<Expenditure, 'id'>) => {
    const newExpenditure: Expenditure = {
      id: Math.random().toString(36).substring(2, 15),
      ...expenditure,
    };

    // Update asset quantities
    setAssets(prevAssets => {
      return prevAssets.map(asset => {
        if (asset.id === expenditure.assetId) {
          return { ...asset, quantity: asset.quantity - expenditure.quantity };
        } else {
          return asset;
        }
      });
    });

    setExpenditures([...expendituresList, newExpenditure]);
  };

  return (
    <DataContext.Provider
      value={{
        bases: basesList,
        assets: assetsList,
        purchases: purchasesList,
        transfers: transfersList,
        assignments: assignmentsList,
        expenditures: expendituresList,
        filters,
        setFilters,
        getAssetById,
        getFilteredAssets,
        getFilteredPurchases,
        getFilteredTransfers,
        getFilteredAssignments,
        getFilteredExpenditures,
        getAssetMetrics,
        addAsset,
        addBase,
        addPurchase,
        addTransfer,
        addAssignment,
        addExpenditure,
        users, // Add users to the context value
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
