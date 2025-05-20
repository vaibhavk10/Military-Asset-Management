
import React from 'react';
import Layout from '../components/Layout';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const { users } = useData();
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        
        {/* Display user settings based on role */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Base:</strong> {user.baseId}</p>
          </div>
        )}
        
        {/* Display users list for admin */}
        {user && user.role === 'Admin' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Users Management</h2>
            <div className="divide-y">
              {users.map(u => (
                <div key={u.id} className="py-3">
                  <p><strong>Name:</strong> {u.name}</p>
                  <p><strong>Role:</strong> {u.role}</p>
                  {u.baseId && <p><strong>Base:</strong> {u.baseId}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Additional settings can be added here */}
      </div>
    </Layout>
  );
};

export default Settings;
