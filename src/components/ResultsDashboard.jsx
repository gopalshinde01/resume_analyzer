import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Award } from 'lucide-react';
import './ResultsDashboard.css';

const ResultsDashboard = ({ data, onReset }) => {
    const { matchPercentage, extractedSkills, missingSkills, improvementSuggestions } = data;

    // Determine score color
    let scoreColorClass = 'text-danger';
    let barColorClass = 'bg-danger';
    if (matchPercentage >= 80) {
        scoreColorClass = 'text-success';
        barColorClass = 'bg-success';
    } else if (matchPercentage >= 50) {
        scoreColorClass = 'text-warning';
        barColorClass = 'bg-warning';
    }

    return (
        <div className="dashboard-container fade-in">

            <div className="dashboard-header">
                <button className="back-btn" onClick={onReset}>
                    <ArrowLeft size={20} /> Back to Upload
                </button>
                <h1>Analysis Results</h1>
            </div>

            <div className="dashboard-grid">

                {/* Match Score Card */}
                <div className="card score-card">
                    <div className="card-header">
                        <h2>ATS Match Score</h2>
                        <Award className={scoreColorClass} size={28} />
                    </div>
                    <div className="score-display">
                        <span className={`score-value ${scoreColorClass}`}>
                            {matchPercentage}%
                        </span>
                        <p className="score-subtitle">Based on required skills and keywords</p>
                    </div>

                    <div className="progress-bar-container">
                        <div
                            className={`progress-bar-fill ${barColorClass}`}
                            style={{ width: `${matchPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Actionable Suggestions Card */}
                <div className="card suggestions-card">
                    <div className="card-header">
                        <h2>Improvement Suggestions</h2>
                        <AlertCircle className="text-warning" size={24} />
                    </div>
                    <ul className="suggestions-list">
                        {improvementSuggestions.map((suggestion, index) => (
                            <li key={index} className="suggestion-item">
                                <div className="bullet-point bg-warning"></div>
                                <p>{suggestion}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Found Skills Card */}
                <div className="card skills-card">
                    <div className="card-header">
                        <h2>Extracted Skills</h2>
                        <CheckCircle className="text-success" size={24} />
                    </div>
                    <div className="skills-tags">
                        {extractedSkills.length > 0 ? (
                            extractedSkills.map((skill, index) => (
                                <span key={index} className="tag tag-success">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p className="empty-state">No relevant skills found.</p>
                        )}
                    </div>
                </div>

                {/* Missing Skills Card */}
                <div className="card skills-card">
                    <div className="card-header">
                        <h2>Missing Keywords</h2>
                        <XCircle className="text-danger" size={24} />
                    </div>
                    <div className="skills-tags">
                        {missingSkills.length > 0 ? (
                            missingSkills.map((skill, index) => (
                                <span key={index} className="tag tag-danger">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p className="empty-state">Great! Your resume matches all core keywords.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ResultsDashboard;
