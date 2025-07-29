import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, Shield, Settings, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserManagementHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'settings'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock user data
  const mockUsers = [
    { id: 1, name: 'राम पाटील', email: 'ram@example.com', role: 'farmer', status: 'active', village: 'अमरावती' },
    { id: 2, name: 'Dr. Priya Sharma', email: 'priya@example.com', role: 'officer', status: 'active', department: 'Agriculture Department' },
    { id: 3, name: 'Prof. Suresh Kumar', email: 'suresh@example.com', role: 'expert', status: 'active', expertise: 'Crop Disease' },
    { id: 4, name: 'अनिल जोशी', email: 'anil@example.com', role: 'farmer', status: 'pending', village: 'नागपूर' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        className="mb-4 flex items-center text-green-600 hover:text-green-800"
        onClick={() => navigate('/')}
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-xl">Manage users, roles, and permissions</p>
        </div>
        
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-yellow-800 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Module Under Development
            </h3>
            
            <p className="text-yellow-700">
              This module is currently being developed. Full user management functionality will be available soon!
            </p>
          </div>
          
          {/* Tabs */}
          <div className="border-b mb-6">
            <div className="flex -mb-px">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'users'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('users')}
              >
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </div>
              </button>
              
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'roles'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('roles')}
              >
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Roles & Permissions
                </div>
              </button>
              
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                <div className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </div>
              </button>
            </div>
          </div>
          
          {/* Search and actions */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div className="relative mb-4 md:mb-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400" disabled>
                Add User
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:bg-gray-100" disabled>
                Export
              </button>
            </div>
          </div>
          
          {/* Users table */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location/Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'farmer' 
                            ? 'bg-green-100 text-green-800' 
                            : user.role === 'officer'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                        }`}>
                          {user.role === 'farmer' 
                            ? 'Farmer' 
                            : user.role === 'officer'
                              ? 'Officer'
                              : 'Expert'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status === 'active' ? 'Active' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.village || user.department || user.expertise || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Roles tab content */}
          {activeTab === 'roles' && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">Roles & Permissions</h3>
              <p className="text-gray-600 mb-4">
                This section will allow you to manage user roles and their associated permissions.
              </p>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          )}
          
          {/* Settings tab content */}
          {activeTab === 'settings' && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Settings className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">User Management Settings</h3>
              <p className="text-gray-600 mb-4">
                Configure user registration, authentication, and security settings.
              </p>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementHome;