import { useState } from 'react';
import api from '../../api';

export default function Login({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            onLogin(); 
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="logo-section">🌿</div>
                    <h2>Welcome Back</h2>
                    <p className="auth-subtitle">Log in to track your EcoLife and stay green.</p>
                    
                    {error && <div className="error-msg">{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="primary-btn">Log In</button>
                    </form>
                    
                    <p className="switch-auth">
                        Don't have an account? <span onClick={onSwitchToRegister}>Register</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
