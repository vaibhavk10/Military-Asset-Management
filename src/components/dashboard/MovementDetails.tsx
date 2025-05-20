
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { AssetMetrics } from '@/types';
import { Plus, ArrowLeftRight, ArrowRight, ArrowLeft } from 'lucide-react';

interface MovementDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: AssetMetrics;
}

const MovementDetails: React.FC<MovementDetailsProps> = ({ isOpen, onClose, metrics }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Net Movement Details</DialogTitle>
          <DialogDescription>
            Breakdown of asset movements during the selected period
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
            <div className="flex items-center">
              <Plus className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium">Purchases</p>
                <p className="text-sm text-gray-500">New assets acquired</p>
              </div>
            </div>
            <span className="font-bold text-green-600">+{metrics.purchases}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
            <div className="flex items-center">
              <ArrowRight className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium">Transfer In</p>
                <p className="text-sm text-gray-500">Assets received from other bases</p>
              </div>
            </div>
            <span className="font-bold text-blue-600">+{metrics.transferIn}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-md">
            <div className="flex items-center">
              <ArrowLeft className="h-5 w-5 text-amber-600 mr-3" />
              <div>
                <p className="text-sm font-medium">Transfer Out</p>
                <p className="text-sm text-gray-500">Assets sent to other bases</p>
              </div>
            </div>
            <span className="font-bold text-amber-600">-{metrics.transferOut}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
            <div className="flex items-center">
              <ArrowLeftRight className="h-5 w-5 text-gray-600 mr-3" />
              <div>
                <p className="text-sm font-medium">Net Movement</p>
                <p className="text-sm text-gray-500">Total change in asset quantity</p>
              </div>
            </div>
            <span className={`font-bold ${metrics.netMovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.netMovement >= 0 ? '+' : ''}{metrics.netMovement}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovementDetails;
