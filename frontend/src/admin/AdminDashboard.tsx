import React, { useEffect, useState } from 'react';
import { Users, FileText, AlertTriangle, CheckCircle, Key, X, Settings } from 'lucide-react';
import client from '../shared/api/client';

interface SystemStats {
  totalUsers: number;
  activeReports: number;
  activeLostReports: number;
  activeFoundReports: number;
  resolvedItems: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface Report {
  id: string;
  name: string;
  type: 'LOST' | 'FOUND';
  status: 'OPEN' | 'RESOLVED';
  date: string;
  location: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeReports: 0,
    activeLostReports: 0,
    activeFoundReports: 0,
    resolvedItems: 0,
  });
  const [resetRequests, setResetRequests] = useState<User[]>([]);
  
  // Quick Actions State
  const [activeAction, setActiveAction] = useState<'users' | 'reports' | 'settings' | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchResetRequests();
    fetchRecentActivity();
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await client.get('/notifications');
      setNotifications(response.data.filter((n: any) => n.type === 'CLAIM_REQUEST'));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleReplyToClaim = async (userId: number, userName: string) => {
    const message = prompt(`Send message to ${userName}:`, "Please come to the office to verify ownership.");
    if (!message) return;

    try {
      await client.post('/notifications/notify-user', {
        userId,
        title: 'Admin Response',
        message
      });
      alert('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await client.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };
  
  const fetchRecentActivity = async () => {
    try {
      const response = await client.get('/admin/activity');
      setRecentActivities(response.data);
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
    }
  };
  
  const fetchSettings = async () => {
    try {
      const response = await client.get('/admin/settings');
      setMaintenanceMode(response.data.maintenance_mode === 'true');
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const fetchResetRequests = async () => {
    try {
      const response = await client.get('/admin/password-requests');
      setResetRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch reset requests:', error);
    }
  };
  
  const handleMaintenanceToggle = async () => {
    try {
      const newStatus = !maintenanceMode;
      await client.post('/admin/settings/maintenance', { enabled: newStatus });
      setMaintenanceMode(newStatus);
      alert(`Maintenance mode ${newStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Failed to toggle maintenance mode:', error);
      alert('Failed to update maintenance mode');
    }
  };
  
  const handleCleanup = async () => {
    if (!confirm('Are you sure you want to run data cleanup? This will permanently delete old resolved items.')) return;
    
    try {
      const response = await client.post('/admin/settings/cleanup');
      alert(response.data.message);
    } catch (error) {
      console.error('Failed to run cleanup:', error);
      alert('Cleanup failed');
    }
  };

  const handleResetPassword = async (userId: string) => {
    const newPassword = prompt('Enter new password for user:');
    if (!newPassword) return;

    try {
      await client.put(`/admin/users/${userId}/password`, { newPassword });
      alert('Password updated successfully');
      fetchResetRequests(); // Refresh list
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('Failed to reset password');
    }
  };

  const handleManageUsers = async () => {
    setActiveAction('users');
    try {
      const response = await client.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleReviewReports = async () => {
    setActiveAction('reports');
    try {
      const [lostRes, foundRes] = await Promise.all([
        client.get('/lost-items?status=OPEN'),
        client.get('/found-items?status=OPEN')
      ]);
      // Normalize data structure if needed
      const lostItems = lostRes.data.items.map((i: any) => ({ ...i, type: 'LOST' }));
      const foundItems = foundRes.data.items.map((i: any) => ({ ...i, type: 'FOUND' }));
      setReports([...lostItems, ...foundItems]);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  const handleSystemSettings = () => {
    setActiveAction('settings');
  };

  const closeAction = () => {
    setActiveAction(null);
  };

  return (
    <div className="space-y-12 animate-fade-in relative">
      <div className="border-b-2 border-white pb-8">
        <h1 className="text-6xl font-black uppercase tracking-tighter text-white mb-4">
          Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Dashboard</span>
        </h1>
        <p className="text-xl text-gray-400 font-light tracking-wide border-l-4 border-white pl-4">
          System Overview & Management Console
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stat Card 1 */}
        <div className="bg-surface border-2 border-white p-8 group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <Users size={40} className="text-white" />
            <span className="text-4xl font-display font-bold text-gray-700 group-hover:text-white transition-colors">01</span>
          </div>
          <h3 className="text-2xl font-bold uppercase tracking-wider mb-2 text-white">Total Users</h3>
          <p className="text-5xl font-black text-white">{stats.totalUsers}</p>
          <div className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-500">
            Registered Accounts
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-surface border-2 border-white p-8 group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <AlertTriangle size={40} className="text-white" />
            <span className="text-4xl font-display font-bold text-gray-700 group-hover:text-white transition-colors">02</span>
          </div>
          <h3 className="text-2xl font-bold uppercase tracking-wider mb-2 text-white">Active Reports</h3>
          <p className="text-5xl font-black text-white">{stats.activeReports}</p>
          <div className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-500">
            Lost: {stats.activeLostReports} | Found: {stats.activeFoundReports}
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-surface border-2 border-white p-8 group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <CheckCircle size={40} className="text-white" />
            <span className="text-4xl font-display font-bold text-gray-700 group-hover:text-white transition-colors">03</span>
          </div>
          <h3 className="text-2xl font-bold uppercase tracking-wider mb-2 text-white">Resolved</h3>
          <p className="text-5xl font-black text-white">{stats.resolvedItems}</p>
          <div className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-500">
            Total recovered items
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Claim Requests */}
        <div className="border-2 border-white bg-surface p-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Claim Requests</h2>
            {notifications.length > 0 && (
              <span className="bg-yellow-600 text-black text-xs font-bold px-2 py-1 rounded-full">{notifications.length}</span>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className="text-gray-500 text-sm font-bold uppercase tracking-widest text-center py-8">
              No pending claims
            </div>
          ) : (
            <div className="space-y-6">
              {notifications.map((notif) => (
                <div key={notif.id} className="flex flex-col gap-2 pb-4 border-b border-gray-800 last:border-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white">{notif.title}</h4>
                    <span className="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-400">{notif.message}</p>
                  <button 
                    onClick={() => handleReplyToClaim(notif.userId, 'User')} // Assuming notification doesn't carry user name directly, simplify for now
                    className="self-end text-xs font-bold uppercase tracking-widest bg-white text-black px-3 py-1 hover:bg-gray-200 transition-colors"
                  >
                    Reply
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Password Reset Requests */}
        <div className="border-2 border-white bg-surface p-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Password Resets</h2>
            {resetRequests.length > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{resetRequests.length}</span>
            )}
          </div>
          
          {resetRequests.length === 0 ? (
            <div className="text-gray-500 text-sm font-bold uppercase tracking-widest text-center py-8">
              No pending requests
            </div>
          ) : (
            <div className="space-y-6">
              {resetRequests.map((user) => (
                <div key={user.id} className="flex items-center gap-4 pb-4 border-b border-gray-800 last:border-0">
                  <div className="w-12 h-12 bg-white flex items-center justify-center shrink-0">
                    <Key className="text-black" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-wide text-white">{user.name}</h4>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => handleResetPassword(user.id)}
                    className="ml-auto text-xs font-bold uppercase tracking-widest bg-white text-black px-4 py-2 hover:bg-gray-200 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="border-2 border-white bg-surface p-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Recent Activity</h2>
          </div>
          
          <div className="space-y-6">
            {recentActivities.length === 0 ? (
              <div className="text-gray-500 text-sm font-bold uppercase tracking-widest text-center py-8">
                No recent activity
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 pb-4 border-b border-gray-800 last:border-0">
                  <div className="w-12 h-12 bg-white flex items-center justify-center shrink-0">
                    {activity.type === 'USER_REGISTERED' ? (
                      <Users className="text-black" size={24} />
                    ) : (
                      <FileText className="text-black" size={24} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-wide text-white">{activity.title}</h4>
                    <p className="text-sm text-gray-400">{activity.description}</p>
                  </div>
                  <span className="ml-auto text-xs font-mono text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()} {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-2 border-white bg-surface p-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={handleManageUsers}
              className="btn-mappa text-left w-full flex justify-between items-center group"
            >
              <span>Manage Users</span>
              <Users size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={handleReviewReports}
              className="btn-mappa-outline text-left w-full flex justify-between items-center group"
            >
              <span>Review Pending Reports</span>
              <AlertTriangle size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={handleSystemSettings}
              className="btn-mappa-outline text-left w-full flex justify-between items-center group"
            >
              <span>System Settings</span>
              <Settings size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      {activeAction && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8 backdrop-blur-sm">
          <div className="bg-black border-2 border-white w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col animate-fade-in shadow-[0_0_50px_rgba(255,255,255,0.1)]">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-zinc-900">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
                {activeAction === 'users' && 'User Management'}
                {activeAction === 'reports' && 'Pending Reports'}
                {activeAction === 'settings' && 'System Settings'}
              </h3>
              <button onClick={closeAction} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {activeAction === 'users' && (
                <div className="space-y-4">
                  <table className="w-full text-left">
                    <thead className="border-b border-gray-700 text-gray-400 text-xs font-bold uppercase tracking-wider">
                      <tr>
                        <th className="pb-3 pl-2">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-zinc-900/50 transition-colors">
                          <td className="py-4 pl-2 font-bold text-white">{user.name}</td>
                          <td className="py-4 text-gray-400">{user.email}</td>
                          <td className="py-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-white text-black' : 'bg-gray-800 text-gray-300'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 text-gray-500 font-mono text-xs">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeAction === 'reports' && (
                <div className="grid grid-cols-1 gap-4">
                  {reports.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 font-bold uppercase tracking-widest">
                      No pending reports found
                    </div>
                  ) : (
                    reports.map(report => (
                      <div key={report.id} className="border border-gray-800 p-4 flex items-center justify-between hover:bg-zinc-900 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-12 ${report.type === 'LOST' ? 'bg-red-500' : 'bg-green-500'}`} />
                          <div>
                            <h4 className="font-bold text-white uppercase">{report.name}</h4>
                            <div className="flex gap-2 text-xs text-gray-400 mt-1">
                              <span className="font-bold text-white bg-gray-800 px-1 rounded">{report.type}</span>
                              <span>•</span>
                              <span>{report.location}</span>
                              <span>•</span>
                              <span>{new Date(report.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <button className="text-xs font-bold uppercase tracking-widest border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors">
                          View
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeAction === 'settings' && (
                <div className="space-y-6">
                  <div className="p-4 border border-gray-800 bg-zinc-900/50">
                    <h4 className="font-bold text-white uppercase mb-2">System Maintenance</h4>
                    <p className="text-sm text-gray-400 mb-4">Enable maintenance mode to prevent new logins (except admins).</p>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={maintenanceMode}
                          onChange={handleMaintenanceToggle}
                        />
                        <div className={`w-10 h-6 rounded-full shadow-inner transition-colors ${maintenanceMode ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                        <div className={`dot absolute w-4 h-4 bg-white rounded-full shadow top-1 transition-all ${maintenanceMode ? 'left-5' : 'left-1'}`}></div>
                      </div>
                      <div className="ml-3 text-gray-300 font-medium text-sm">
                        {maintenanceMode ? 'Maintenance Enabled' : 'Normal Operation'}
                      </div>
                    </label>
                  </div>
                  
                  <div className="p-4 border border-gray-800 bg-zinc-900/50">
                    <h4 className="font-bold text-white uppercase mb-2">Data Retention</h4>
                    <p className="text-sm text-gray-400 mb-4">Automatically archive reports older than 90 days.</p>
                    <button 
                      onClick={handleCleanup}
                      className="bg-white text-black text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-gray-200"
                    >
                      Run Cleanup Now
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-800 bg-zinc-900 flex justify-end">
              <button 
                onClick={closeAction}
                className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
