
import React, { useState } from 'react';
import { Package, ArrowLeftRight, Users, Box } from 'lucide-react';
import Layout from '../components/Layout';
import MetricCard from '../components/dashboard/MetricCard';
import MovementDetails from '../components/dashboard/MovementDetails';
import Filters from '../components/Filters';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const { getAssetMetrics, getFilteredAssets } = useData();
  const [showMovementDetails, setShowMovementDetails] = useState(false);
  
  const metrics = getAssetMetrics();
  const assets = getFilteredAssets();
  
  // Prepare chart data by equipment type
  const equipmentTypes = [...new Set(assets.map(asset => asset.type))];
  const chartData = equipmentTypes.map(type => {
    const assetsOfType = assets.filter(asset => asset.type === type);
    const totalQuantity = assetsOfType.reduce((sum, asset) => sum + asset.quantity, 0);
    
    return {
      type,
      quantity: totalQuantity
    };
  });
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Asset Management Dashboard</h1>
        </div>
        
        <Filters />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Opening Balance"
            value={metrics.openingBalance}
            icon={<Package />}
            className="border-l-4 border-blue-500"
          />
          <MetricCard
            title="Net Movement"
            value={metrics.netMovement >= 0 ? `+${metrics.netMovement}` : metrics.netMovement}
            icon={<ArrowLeftRight />}
            className={`border-l-4 ${metrics.netMovement >= 0 ? 'border-green-500' : 'border-red-500'}`}
            onClick={() => setShowMovementDetails(true)}
          />
          <MetricCard
            title="Assigned"
            value={metrics.assigned}
            icon={<Users />}
            className="border-l-4 border-amber-500"
          />
          <MetricCard
            title="Closing Balance"
            value={metrics.closingBalance}
            icon={<Box />}
            className="border-l-4 border-purple-500"
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Asset Distribution by Type</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" name="Quantity" fill="#446274" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <MovementDetails 
          isOpen={showMovementDetails}
          onClose={() => setShowMovementDetails(false)}
          metrics={{
            ...metrics,
            transferIn: 0,
            transferOut: 0,
            expended: 0
          }}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
