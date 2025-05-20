
import { Asset, Base, Purchase, Transfer, Assignment, Expenditure, User } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'General Smith',
    role: 'Admin',
  },
  {
    id: '2',
    name: 'Colonel Johnson',
    role: 'Base Commander',
    baseId: '1',
  },
  {
    id: '3',
    name: 'Lieutenant Davis',
    role: 'Logistics Officer',
    baseId: '1',
  },
  {
    id: '4',
    name: 'Major Wilson',
    role: 'Base Commander',
    baseId: '2',
  },
];

export const bases: Base[] = [
  {
    id: '1',
    name: 'Fort Alpha',
    location: 'Northern Region',
    commander: 'Colonel Johnson',
  },
  {
    id: '2',
    name: 'Base Bravo',
    location: 'Southern Region',
    commander: 'Major Wilson',
  },
  {
    id: '3',
    name: 'Camp Charlie',
    location: 'Eastern Region',
    commander: 'Colonel Harris',
  },
];

export const assets: Asset[] = [
  {
    id: '1',
    name: 'M4 Rifle',
    type: 'Weapon',
    description: 'Standard issue assault rifle',
    quantity: 500,
    baseId: '1',
    status: 'Available',
    serialNumber: 'WPN-1001',
    purchaseDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Humvee',
    type: 'Vehicle',
    description: 'All-terrain tactical vehicle',
    quantity: 30,
    baseId: '1',
    status: 'Available',
    serialNumber: 'VEH-2001',
    purchaseDate: '2023-02-20',
  },
  {
    id: '3',
    name: '5.56mm Ammo',
    type: 'Ammunition',
    description: 'Standard rifle ammunition',
    quantity: 25000,
    baseId: '1',
    status: 'Available',
    purchaseDate: '2023-01-15',
  },
  {
    id: '4',
    name: 'Radio Set',
    type: 'Communication',
    description: 'Tactical field communication device',
    quantity: 100,
    baseId: '2',
    status: 'Available',
    serialNumber: 'COM-3001',
    purchaseDate: '2023-03-10',
  },
  {
    id: '5',
    name: 'First Aid Kit',
    type: 'Medical',
    description: 'Standard field medical kit',
    quantity: 250,
    baseId: '2',
    status: 'Available',
    purchaseDate: '2023-02-05',
  },
  {
    id: '6',
    name: 'M9 Pistol',
    type: 'Weapon',
    description: 'Standard issue sidearm',
    quantity: 300,
    baseId: '2',
    status: 'Available',
    serialNumber: 'WPN-1002',
    purchaseDate: '2023-01-25',
  },
  {
    id: '7',
    name: 'Armored Personnel Carrier',
    type: 'Vehicle',
    description: 'Troop transport vehicle with armor protection',
    quantity: 15,
    baseId: '3',
    status: 'Available',
    serialNumber: 'VEH-2002',
    purchaseDate: '2023-02-28',
  },
];

export const purchases: Purchase[] = [
  {
    id: '1',
    assetName: 'M4 Rifle',
    type: 'Weapon',
    quantity: 100,
    baseId: '1',
    date: '2023-01-15',
    cost: 80000,
    supplier: 'Military Weapons Inc.',
  },
  {
    id: '2',
    assetName: 'Humvee',
    type: 'Vehicle',
    quantity: 5,
    baseId: '1',
    date: '2023-02-20',
    cost: 750000,
    supplier: 'Defense Vehicles Corp.',
  },
  {
    id: '3',
    assetName: '5.56mm Ammo',
    type: 'Ammunition',
    quantity: 10000,
    baseId: '1',
    date: '2023-01-15',
    cost: 5000,
    supplier: 'Military Weapons Inc.',
  },
  {
    id: '4',
    assetName: 'First Aid Kit',
    type: 'Medical',
    quantity: 100,
    baseId: '2',
    date: '2023-02-05',
    cost: 15000,
    supplier: 'MedTech Supplies',
  },
  {
    id: '5',
    assetName: 'Radio Set',
    type: 'Communication',
    quantity: 50,
    baseId: '2',
    date: '2023-03-10',
    cost: 125000,
    supplier: 'TacComm Systems',
  },
];

export const transfers: Transfer[] = [
  {
    id: '1',
    assetId: '1', // M4 Rifle
    fromBaseId: '1',
    toBaseId: '2',
    quantity: 50,
    date: '2023-03-15',
    status: 'Completed',
    initiatedBy: 'Lieutenant Davis',
  },
  {
    id: '2',
    assetId: '3', // 5.56mm Ammo
    fromBaseId: '1',
    toBaseId: '2',
    quantity: 5000,
    date: '2023-03-15',
    status: 'Completed',
    initiatedBy: 'Lieutenant Davis',
  },
  {
    id: '3',
    assetId: '6', // M9 Pistol
    fromBaseId: '2',
    toBaseId: '3',
    quantity: 25,
    date: '2023-04-10',
    status: 'In Transit',
    initiatedBy: 'Major Wilson',
  },
  {
    id: '4',
    assetId: '4', // Radio Set
    fromBaseId: '2',
    toBaseId: '1',
    quantity: 20,
    date: '2023-04-05',
    status: 'Completed',
    initiatedBy: 'Major Wilson',
  },
];

export const assignments: Assignment[] = [
  {
    id: '1',
    assetId: '1', // M4 Rifle
    personnelId: 'PERS-001',
    quantity: 100,
    baseId: '1',
    assignmentDate: '2023-03-20',
  },
  {
    id: '2',
    assetId: '2', // Humvee
    personnelId: 'PERS-002',
    quantity: 10,
    baseId: '1',
    assignmentDate: '2023-03-25',
  },
  {
    id: '3',
    assetId: '4', // Radio Set
    personnelId: 'PERS-003',
    quantity: 30,
    baseId: '2',
    assignmentDate: '2023-04-01',
  },
];

export const expenditures: Expenditure[] = [
  {
    id: '1',
    assetId: '3', // 5.56mm Ammo
    quantity: 3000,
    baseId: '1',
    date: '2023-04-10',
    reason: 'Training exercise',
  },
  {
    id: '2',
    assetId: '5', // First Aid Kit
    quantity: 20,
    baseId: '2',
    date: '2023-04-15',
    reason: 'Field operation',
  },
];

// Current user for mock login
export const currentUser: User = users[0]; // Admin user
