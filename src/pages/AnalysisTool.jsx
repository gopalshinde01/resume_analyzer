import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import UploadForm from '../components/UploadForm';
import ResultsDashboard from '../components/ResultsDashboard';
import html2pdf from 'html2pdf.js';
import { Download, AlertCircle } from 'lucide-react';

const AnalysisTool = () => {
    const { user, updateSubscription } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const reportRef = useRef();

    const historyId = searchParams.get('id');

    useEffect(() => {
        // If an ID is present in URL, fetch it from history
        if (historyId) {
            const fetchAnalysis = async () => {
                setIsLoading(true);
                try {
                    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    const { data } = await axios.get('http://localhost:5000/api/analysis/history', {
                        headers: { 'Authorization': `Bearer ${userInfo.token}` }
                    });
                    const found = data.find(item => item._id === historyId);
                    if (found) {
                        setAnalysisResult(found);
                    } else {
                        setError('Analysis not found.');
                    }
                } catch (err) {
                    setError('Failed to load analysis.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAnalysis();
        }
    }, [historyId]);

    const handleAnalyze = async (file, jobDescription) => {
        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const response = await axios.post('http://localhost:5000/api/analysis', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userInfo.token}`
                },
            });

            setAnalysisResult(response.data);

            // Update local user analysis count
            const updatedUser = { ...user, analysisCount: user.analysisCount + 1 };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            updateSubscription(user.subscriptionPlan); // Just triggering context update

        } catch (err) {
            console.error('Error analyzing resume:', err);
            const message = err.response?.data?.error || err.message || 'An unexpected error occurred.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setAnalysisResult(null);
        setError('');
        navigate('/analyze', { replace: true });
    };

    const handleDownloadPDF = () => {
        const element = reportRef.current;
        const opt = {
            margin: 0.5,
            filename: `Resume_Analysis_${new Date().getTime()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 0' }}>
            {error && (
                <div className="error-message fade-in" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {!analysisResult ? (
                <UploadForm
                    onAnalyze={handleAnalyze}
                    isLoading={isLoading}
                />
            ) : (
                <div className="fade-in">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                        <button
                            onClick={handleDownloadPDF}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                background: 'white', color: 'var(--primary)', border: '1px solid var(--primary)',
                                padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                                fontWeight: '600', transition: 'var(--transition)'
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                            onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--primary)'; }}
                        >
                            <Download size={18} /> Download PDF Report
                        </button>
                    </div>

                    <div ref={reportRef} style={{ padding: '1rem', background: 'var(--bg-main)' }}>
                        <ResultsDashboard
                            data={analysisResult}
                            onReset={handleReset}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalysisTool;
