import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import './Login.css';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(async () => {
            setIsLoading(false);
            // Here we would check credentials and get rol
            try {

                const Userdata = await axios.post('https://srinidhihostelsbackend.onrender.com/api/students/studentlogin', formData);
                console.log('Userdata', Userdata);
                setSuccess('✓ Login successful! Redirecting...');

                setTimeout(() => {
                    setSuccess('');
                    const userData = {
                        id: Userdata?.data?.data?._id,
                        name: Userdata?.data?.data?.StudentName,
                        email: Userdata?.data?.data?.email,
                        role: Userdata?.data?.data?.Role
                    };
                    sessionStorage.setItem('user', JSON.stringify(userData));

                    if (Userdata?.data?.data?.Role === 'admin') {
                        localStorage.setItem('adminToken', Userdata?.data?.token);
                        navigate('/admin-dashboard');
                        return;
                    }
                    else {
                        localStorage.setItem('studentToken', Userdata?.data?.token);
                        navigate('/student-dashboard');
                        return;
                    }
                }, 2000);
            }
            catch (error) {
                if (error.response && error.response.status === 400 && error.response.data.message === 'Invalid credentials') {
                    setError('Invalid credentials.');
                } else if (error.response && error.response.data && error.response.data.message === 'Student not found! Please register') {
                    setError(error.response.data.message);
                } else {
                    setError('Registration failed. Please try again.');
                }
                return;
            }

        }, 1500);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        Srinidhi  <span className="text-gradient">Hostels</span>
                    </Link>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Login to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your registered email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {success && <div className="success-message">{success}</div>}
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn-auth" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
