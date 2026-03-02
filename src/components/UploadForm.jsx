import { useState } from 'react';
import { UploadCloud, File, FileText, CheckCircle, X } from 'lucide-react';
import '../styles/main.css';
import './UploadForm.css';

const UploadForm = ({ onAnalyze, isLoading }) => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile) => {
        setError('');

        // Check file type
        const isValidType =
            selectedFile.type === 'application/pdf' ||
            selectedFile.name.endsWith('.docx');

        if (!isValidType) {
            setError('Please upload a PDF or DOCX file.');
            return;
        }

        // Check size (Max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size exceeds 5MB limit.');
            return;
        }

        setFile(selectedFile);
    };

    const removeFile = () => {
        setFile(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload a resume.');
            return;
        }
        if (!jobDescription.trim()) {
            setError('Please provide a job description.');
            return;
        }

        onAnalyze(file, jobDescription);
    };

    return (
        <div className="upload-container fade-in">
            <div className="upload-header">
                <h1>Match Your Resume to the Perfect Job</h1>
                <p>AI-powered analysis to optimize your resume and beat the ATS.</p>
            </div>

            <form onSubmit={handleSubmit} className="upload-card">

                <div className="form-section">
                    <label className="section-label">1. Upload Resume (PDF/DOCX)</label>

                    <div
                        className={`dropzone ${isDragging ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => !file && document.getElementById('file-upload').click()}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            className="file-input"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                        />

                        {file ? (
                            <div className="file-info" onClick={(e) => e.stopPropagation()}>
                                <div className="file-icon-wrapper">
                                    {file.name.endsWith('.pdf') ? <FileText size={32} color="var(--danger)" /> : <File size={32} color="var(--primary)" />}
                                </div>
                                <div className="file-details">
                                    <span className="file-name">{file.name}</span>
                                    <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                                <button type="button" className="remove-btn" onClick={removeFile}>
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="upload-prompt">
                                <div className="upload-icon-wrapper">
                                    <UploadCloud size={40} className="upload-icon" />
                                </div>
                                <p className="primary-text">Click to upload or drag and drop</p>
                                <p className="secondary-text">PDF or DOCX (Max 5MB)</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-section">
                    <label className="section-label">2. Paste Job Description</label>
                    <div className="textarea-wrapper">
                        <textarea
                            className="jd-textarea"
                            placeholder="Paste the target job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={8}
                        ></textarea>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                    type="submit"
                    className={`analyze-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading || !file || !jobDescription.trim()}
                >
                    {isLoading ? (
                        <span className="btn-content">Analyzing...</span>
                    ) : (
                        <span className="btn-content">
                            <CheckCircle size={20} /> Analyze Resume
                        </span>
                    )}
                </button>

            </form>
        </div>
    );
};

export default UploadForm;
