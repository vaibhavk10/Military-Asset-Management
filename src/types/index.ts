
// Asset Types
export type EquipmentType = 'Weapon' | 'Vehicle' | 'Ammunition' | 'Communication' | 'Medical';

export interface Asset {
  id: string;
  name: string;
  type: EquipmentType;
  description: string;
  quantity: number;
  baseId: string;
  status: 'Available' | 'Assigned' | 'In Transit' | 'Maintenance';
  serialNumber?: string;
  purchaseDate: string;
}

export interface Base {
  id: string;
  name: string;
  location: string;
  commander: string;
}

export interface Transfer {
  id: string;
  assetId: string;
  fromBaseId: string;
  toBaseId: string;
  quantity: number;
  date: string;
  status: 'Pending' | 'In Transit' | 'Completed' | 'Cancelled';
  initiatedBy: string;
}

export interface Purchase {
  id: string;
  assetName: string;
  type: EquipmentType;
  quantity: number;
  baseId: string;
  date: string;
  cost: number;
  supplier: string;
}

export interface Assignment {
  id: string;
  assetId: string;
  personnelId: string;
  quantity: number;
  baseId: string;
  assignmentDate: string;
  returnDate?: string;
}

export interface Expenditure {
  id: string;
  assetId: string;
  quantity: number;
  baseId: string;
  date: string;
  reason: string;
}

// User and Role Types
export type UserRole = 'Admin' | 'Base Commander' | 'Logistics Officer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  baseId?: string; // Only needed for Base Commander and Logistics Officer
}

// Dashboard Metrics
export interface AssetMetrics {
  openingBalance: number;
  closingBalance: number;
  netMovement: number;
  purchases: number;
  transferIn: number;
  transferOut: number;
  assigned: number;
  expended: number;
}

// Filter Types
export interface DateFilter {
  startDate: string;
  endDate: string;
}

export interface Filters {
  date?: DateFilter;
  baseId?: string;
  equipmentType?: EquipmentType;
}
