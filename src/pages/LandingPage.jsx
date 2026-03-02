import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Shield, FileText } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page fade-in">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Optimize Your Resume with <span className="text-primary">AI Precision</span>
                    </h1>
                    <p className="hero-subtitle">
                        Beat the Applicant Tracking Systems (ATS). Our advanced AI analyzes your resume against target job descriptions, identifies missing keywords, and provides actionable feedback to help you land more interviews.
                    </p>
                    <div className="hero-cta">
                        <Link to="/register" className="btn-primary-large">
                            Start Your Free Scan <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>

                {/* Mock Graphic / Illustration */}
                <div className="hero-graphic">
                    <div className="glass-card mockup">
                        <div className="mockup-header">
                            <div className="dots"><span /><span /><span /></div>
                            <span className="mockup-title">Analysis Complete</span>
                        </div>
                        <div className="mockup-body">
                            <div className="mockup-score">92% Match</div>
                            <div className="mockup-bar"><div className="mockup-fill" style={{ width: '92%' }}></div></div>
                            <div className="mockup-item">
                                <CheckCircle className="text-success" size={16} /> React, Node.js, GraphQL
                            </div>
                            <div className="mockup-item">
                                <Shield className="text-warning" size={16} /> Suggested: Add CI/CD metrics
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <h2 className="section-title">Why Choose Pro?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon mb-4"><Zap size={32} /></div>
                        <h3>Instant AI Feedback</h3>
                        <p>Get immediate, actionable insights powered by the latest GPT models tailored specifically for ATS screening.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon mb-4"><FileText size={32} /></div>
                        <h3>PDF Export</h3>
                        <p>Download your analysis reports directly to PDF to keep track of your progress and share with mentors.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon mb-4"><Shield size={32} /></div>
                        <h3>Analysis History</h3>
                        <p>Save unlimited analyses and track your resume improvements over time from a personalized dashboard.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
