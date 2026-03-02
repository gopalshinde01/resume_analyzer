import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Check, Star } from 'lucide-react';
import './PricingPage.css';

const PricingPage = () => {
    const { user, updateSubscription } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpgrade = async () => {
        setIsLoading(true);
        setMessage('');
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const { data } = await axios.post('http://localhost:5000/api/subscription/upgrade', {}, {
                headers: { 'Authorization': `Bearer ${userInfo.token}` }
            });
            updateSubscription('pro');
            setMessage(data.message);
        } catch (error) {
            setMessage('Upgrade failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pricing-page fade-in">
            <div className="pricing-header">
                <h1 className="section-title">Simple, transparent pricing</h1>
                <p>Unlock the full power of AI to land your dream job.</p>
            </div>

            {message && (
                <div className={`message-banner ${message.includes('failed') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <div className="pricing-grid">
                {/* Free Plan */}
                <div className="pricing-card">
                    <div className="pricing-card-header">
                        <h3>Basic</h3>
                        <div className="price">$0<span>/forever</span></div>
                        <p>Perfect to try out our ATS analysis.</p>
                    </div>
                    <ul className="pricing-features">
                        <li><Check size={18} className="text-success" /> Up to 5 AI Analyses</li>
                        <li><Check size={18} className="text-success" /> Basic Skills Matching</li>
                        <li><Check size={18} className="text-success" /> View Match Score</li>
                        <li className="disabled"><Check size={18} /> PDF Report Download</li>
                        <li className="disabled"><Check size={18} /> Unlimited History</li>
                    </ul>
                    <button className="btn-primary-outline" disabled style={{ width: '100%', marginTop: 'auto' }}>
                        {user.subscriptionPlan === 'free' ? 'Current Plan' : 'Free Forever'}
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="pricing-card pro">
                    <div className="pro-badge-top"><Star size={14} /> MOST POPULAR</div>
                    <div className="pricing-card-header">
                        <h3>Pro</h3>
                        <div className="price">$9.99<span>/month</span></div>
                        <p>For serious job seekers needing an edge.</p>
                    </div>
                    <ul className="pricing-features">
                        <li><Check size={18} className="text-primary" /> Unlimited AI Analyses</li>
                        <li><Check size={18} className="text-primary" /> Advanced Suggestions</li>
                        <li><Check size={18} className="text-primary" /> Deep Keyword Insights</li>
                        <li><Check size={18} className="text-primary" /> PDF Report Download</li>
                        <li><Check size={18} className="text-primary" /> Unlimited History Retention</li>
                    </ul>

                    {user.subscriptionPlan === 'pro' ? (
                        <button className="btn-primary-large" disabled style={{ width: '100%', marginTop: 'auto', background: 'var(--success)' }}>
                            Active Subscription
                        </button>
                    ) : (
                        <button
                            className="btn-primary-large"
                            style={{ width: '100%', marginTop: 'auto' }}
                            onClick={handleUpgrade}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Upgrade Now'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
