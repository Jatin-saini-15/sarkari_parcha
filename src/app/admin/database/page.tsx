'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  preferredExams?: string[];
  isPremium: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  password?: string;
  latestSubscription?: {
    id: string;
    type: string;
    status: string;
    startDate: string;
    endDate: string;
    couponCode?: string;
    amount?: number;
  };
  remainingDays: number;
}

export default function DatabaseViewer() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<DatabaseUser | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    // Check if user has admin/owner role
    // @ts-expect-error - NextAuth session type
    const userRole = session.user?.role;
    if (userRole !== 'admin' && userRole !== 'owner') {
      router.push('/dashboard');
      return;
    }
    
    fetchDatabaseData();
  }, [session, status, router]);

  const fetchDatabaseData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching database data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading database...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `database_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Database Viewer
              </h1>
              <p className="text-gray-600 mt-1">
                Raw database data for testing and debugging purposes
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                {users.length} records found
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportToJSON}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export JSON
              </button>
              <button
                onClick={fetchDatabaseData}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Premium Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{users.filter(u => u.isPremium).length}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">With Phone</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{users.filter(u => u.phone).length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">With Location</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{users.filter(u => u.city && u.state).length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">All Users ({users.length})</h2>
                  <p className="text-sm text-gray-600 mt-1">Click on a user to view detailed information</p>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                  Live Data
                </div>
              </div>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-all duration-150 ${
                    selectedUser?.id === user.id ? 'bg-blue-50 border-blue-100 shadow-sm' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm font-semibold">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.city && user.state && (
                          <p className="text-xs text-gray-400">{user.city}, {user.state}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex gap-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.isPremium 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isPremium ? '⭐ Premium' : '🆓 Free'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === 'owner' ? 'bg-red-100 text-red-800' :
                          user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
              {selectedUser && (
                <p className="text-sm text-gray-600 mt-1">ID: <code className="bg-gray-100 px-1 rounded text-xs">{selectedUser.id}</code></p>
              )}
            </div>
            <div className="p-6">
              {selectedUser ? (
                <div className="space-y-6">
                  {/* User Avatar & Basic Info */}
                  <div className="text-center pb-6 border-b border-gray-100">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-white text-2xl font-bold">
                        {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="flex justify-center gap-2 mt-3">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        selectedUser.isPremium 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedUser.isPremium ? '⭐ Premium' : '🆓 Free'}
                      </span>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        selectedUser.role === 'owner' ? 'bg-red-100 text-red-800' :
                        selectedUser.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                        <p className="text-sm text-gray-900">{selectedUser.phone || 'Not provided'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                        <p className="text-sm text-gray-900">
                          {selectedUser.city && selectedUser.state 
                            ? `${selectedUser.city}, ${selectedUser.state}` 
                            : 'Not provided'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Preferred Exams */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Preferred Exams
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {selectedUser.preferredExams && selectedUser.preferredExams.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.preferredExams.map((exam: string, index: number) => (
                            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                              {exam}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No preferences set</p>
                      )}
                    </div>
                  </div>

                  {/* Subscription Information */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Subscription Details
                    </h4>
                    {selectedUser.latestSubscription ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg text-center">
                            <label className="block text-xs font-medium text-blue-600 mb-1">Remaining Days</label>
                            <p className="text-2xl font-bold text-blue-700">{selectedUser.remainingDays}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg text-center">
                            <label className="block text-xs font-medium text-green-600 mb-1">Status</label>
                            <p className="text-sm font-semibold text-green-700">{selectedUser.latestSubscription.status}</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg text-center">
                            <label className="block text-xs font-medium text-purple-600 mb-1">Type</label>
                            <p className="text-sm font-semibold text-purple-700">
                              {selectedUser.latestSubscription.type === 'FREE_COUPON' ? 'Free Launch' : selectedUser.latestSubscription.type}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                            <p className="text-sm text-gray-900">{formatDate(selectedUser.latestSubscription.startDate)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                            <p className="text-sm text-gray-900">{formatDate(selectedUser.latestSubscription.endDate)}</p>
                          </div>
                        </div>
                        {selectedUser.latestSubscription.couponCode && (
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <label className="block text-xs font-medium text-yellow-600 mb-1">Coupon Used</label>
                            <p className="text-sm text-yellow-800 font-mono">{selectedUser.latestSubscription.couponCode}</p>
                          </div>
                        )}
                        {selectedUser.latestSubscription.amount && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <label className="block text-xs font-medium text-green-600 mb-1">Amount Paid</label>
                            <p className="text-sm text-green-800 font-semibold">₹{selectedUser.latestSubscription.amount}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-500">No subscription found</p>
                      </div>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Account Timeline
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Created At</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Last Updated</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedUser.updatedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Security Information
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Password Hash</label>
                      <p className="text-xs text-gray-600 font-mono break-all">
                        {selectedUser.password ? selectedUser.password.substring(0, 60) + '...' : 'Not available'}
                      </p>
                    </div>
                  </div>

                  {/* Raw JSON */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Raw JSON Data
                    </h4>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
                      <pre className="text-xs text-green-400 font-mono max-h-60 overflow-auto">
                        {JSON.stringify(selectedUser, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a User</h3>
                  <p className="text-gray-500">Click on any user from the list to view their detailed information</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 