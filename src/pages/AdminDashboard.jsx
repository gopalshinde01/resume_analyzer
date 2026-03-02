import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Activity, Star } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, proUsers: 0, totalAnalysis: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAdminData = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { 'Authorization': `Bearer ${userInfo.token}` } };

            const [usersRes, statsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/users', config),
                axios.get('http://localhost:5000/api/admin/stats', config)
            ]);

            setUsers(usersRes.data);
            setStats(statsRes.data);
        } catch (err) {
            setError('Failed to fetch admin data. Are you sure you have admin privileges?');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            await axios.put(`http://localhost:5000/api/admin/user/${userId}/role`, { role: newRole }, {
                headers: { 'Authorization': `Bearer ${userInfo.token}` }
            });
            // Optmistic update
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            alert('Failed to update user role');
        }
    };

    if (loading) return <div className="spinner" style={{ marginTop: '4rem' }}></div>;

    return (
        <div className="admin-page fade-in">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage users and view system statistics.</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="admin-stats-row">
                <div className="admin-stat-card">
                    <div className="icon-wrapper bg-primary-light">
                        <Users className="text-primary" />
                    </div>
                    <div>
                        <h3>Total Users</h3>
                        <p className="admin-stat-value">{stats.totalUsers}</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="icon-wrapper bg-warning-light">
                        <Star className="text-warning" />
                    </div>
                    <div>
                        <h3>Pro Subscribers</h3>
                        <p className="admin-stat-value">{stats.proUsers}</p>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="icon-wrapper bg-success-light" style={{ background: 'var(--success-bg)' }}>
                        <Activity className="text-success" />
                    </div>
                    <div>
                        <h3>Total Analyses</h3>
                        <p className="admin-stat-value">{stats.totalAnalysis}</p>
                    </div>
                </div>
            </div>

            <div className="admin-table-container">
                <h2>Registered Users</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Plan</th>
                            <th>Analyses</th>
                            <th>Joined</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`plan-badge ${user.subscriptionPlan === 'pro' ? 'pro' : 'free'}`}>
                                        {user.subscriptionPlan.toUpperCase()}
                                    </span>
                                </td>
                                <td>{user.analysisCount}</td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <select
                                        className="role-select"
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
