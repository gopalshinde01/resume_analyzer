import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <Activity className="logo-icon" size={28} />
                    <div className="logo-text">
                        AI Resume<span>Analyzer Pro</span>
                    </div>
                </Link>

                <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </div>

                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-item">Dashboard</Link>
                            <Link to="/analyze" className="nav-item">New Analysis</Link>
                            <Link to="/pricing" className="nav-item">Pricing</Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="nav-item">Admin</Link>
                            )}
                            <div className="user-profile-menu">
                                <span className="user-greeting">
                                    <User size={18} /> Hi, {user.name.split(' ')[0]}
                                </span>
                                {user.subscriptionPlan === 'pro' && (
                                    <span className="pro-badge">PRO</span>
                                )}
                                <button onClick={handleLogout} className="logout-btn">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-item">Login</Link>
                            <Link to="/register" className="btn-primary-outline">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
