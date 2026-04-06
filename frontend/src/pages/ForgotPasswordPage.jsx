import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, ArrowRight, CheckCircle, Mail, Lock } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to send OTP');
            }
            
            setMessage(data.message || 'OTP sent successfully to your email');
            setStep(2);
        } catch (err) {
            setError(err.message || 'Failed to send OTP. Please check the email entered.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword || !confirmPassword) {
            setError('Please fill all fields');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setMessage(data.message || 'Password reset successfully');
            setStep(3);
        } catch (err) {
            setError(err.message || 'Failed to reset password. Check your OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon-wrapper">
                        <div className="auth-icon">
                            <BookOpen size={40} />
                        </div>
                    </div>
                    <h2 className="auth-title">Forgot Password</h2>
                    <p className="auth-subtitle">
                        {step === 1 && 'Enter your email to receive an OTP'}
                        {step === 2 && 'Enter the OTP and your new password'}
                        {step === 3 && 'Password Reset Complete'}
                    </p>
                </div>

                {error && <div className="error-message">{error}</div>}
                {message && <div style={{ 
                    padding: '1rem', 
                    marginBottom: '1.5rem', 
                    borderRadius: '0.5rem', 
                    backgroundColor: '#d1fae5', 
                    color: '#065f46',
                    border: '1px solid #a7f3d0'
                }}>
                    {message}
                </div>}

                {step === 1 && (
                    <form onSubmit={handleSendOtp}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="form-input"
                                    placeholder="your-email@gmail.com"
                                    style={{ paddingLeft: '40px' }}
                                />
                                <Mail size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}/>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                                style={{ width: '100%' }}
                            >
                                {loading ? 'Sending Request...' : (
                                    <>
                                        Send OTP
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label className="form-label">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="form-input"
                                placeholder="6-digit code"
                                maxLength="6"
                                style={{ textAlign: 'center', letterSpacing: '0.2em' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="form-input"
                                    placeholder="••••••••"
                                    style={{ paddingLeft: '40px' }}
                                />
                                <Lock size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="form-input"
                                    placeholder="••••••••"
                                    style={{ paddingLeft: '40px' }}
                                />
                                <Lock size={20} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}/>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                                style={{ width: '100%' }}
                            >
                                {loading ? 'Resetting Password...' : (
                                    <>
                                        Reset Password
                                        <CheckCircle size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div style={{ textAlign: 'center' }}>
                        <CheckCircle size={60} style={{ color: '#10b981', margin: '0 auto 1.5rem auto' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Success!</h3>
                        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                            Your password has been successfully reset.
                        </p>
                        <Link to="/login" className="btn-primary" style={{ display: 'flex', textDecoration: 'none', justifyContent: 'center' }}>
                            Back to Login
                        </Link>
                    </div>
                )}

                {step !== 3 && (
                    <div className="auth-footer">
                        Remember your password?{' '}
                        <Link to="/login" className="auth-link">
                            Sign in here
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
