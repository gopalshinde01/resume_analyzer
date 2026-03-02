import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileText, Plus, Clock, Award } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo?.token) return;

            try {
                const { data } = await axios.get('http://localhost:5000/api/analysis/history', {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` }
                });
                setHistory(data);
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="dashboard-page fade-in">
            <div className="dashboard-header">
                <div>
                    <h1>My Dashboard</h1>
                    <p>Welcome back, {user.name}. Here is your analysis overview.</p>
                </div>
                <Link to="/analyze" className="btn-primary-large" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
                    <Plus size={18} /> New Analysis
                </Link>
            </div>

            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-icon bg-primary-light"><FileText className="text-primary" /></div>
                    <div className="stat-content">
                        <h3>Total Scans</h3>
                        <p className="stat-value">{user.analysisCount}</p>
                    </div>
                </div>
                {user.subscriptionPlan === 'free' && (
                    <div className="stat-card">
                        <div className="stat-icon bg-warning-light"><Award className="text-warning" /></div>
                        <div className="stat-content">
                            <h3>Scans Remaining</h3>
                            <p className="stat-value">{Math.max(0, 5 - user.analysisCount)}</p>
                        </div>
                    </div>
                )}
            </div>

            <h2 className="section-title" style={{ textAlign: 'left', marginTop: '3rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Analysis History</h2>

            {loading ? (
                <div className="spinner"></div>
            ) : history.length === 0 ? (
                <div className="empty-state-card">
                    <FileText size={48} className="text-gray" />
                    <h3>No analyses found</h3>
                    <p>You haven't scanned any resumes yet. Start your first scan to see insights here.</p>
                    <Link to="/analyze" className="btn-primary-outline" style={{ marginTop: '1rem', display: 'inline-block' }}>Get Started</Link>
                </div>
            ) : (
                <div className="history-grid">
                    {history.map((item) => (
                        <div key={item._id} className="history-card">
                            <div className="history-score">
                                <Award className={item.matchPercentage >= 80 ? 'text-success' : item.matchPercentage >= 50 ? 'text-warning' : 'text-danger'} size={32} />
                                <span className="score-text">{item.matchPercentage}%</span>
                            </div>
                            <div className="history-details">
                                <h4>{item.jobTitle || 'Untitled Job Analysis'}</h4>
                                <div className="history-meta">
                                    <Clock size={14} /> {formatDate(item.createdAt)}
                                </div>
                                <div className="history-tags">
                                    <span className="tag text-success">{item.extractedSkills.length} Skills Match</span>
                                    <span className="tag text-danger">{item.missingSkills.length} Missing</span>
                                </div>
                            </div>
                            <Link to={`/analyze?id=${item._id}`} className="view-btn">View</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
