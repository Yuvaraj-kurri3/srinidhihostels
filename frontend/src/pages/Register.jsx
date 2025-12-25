import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css'; // Reuse styles
import axios from 'axios';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        StudentRoomNumber:'',
        StudentName: '',
        email: '',
        password: '',
        confirmPassword: '',
        Role: 'student', // Default role
        secretCode: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Clear secret code if switching to student
            ...(name === 'role' && value === 'student' ? { secretCode: '' } : {})
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.Role === 'admin' && !formData.secretCode) {
            setError('Hostel Secret Code is required for Management');
            return;
        }
           if (formData.Role === 'admin' && formData.secretCode!=='HOSTEL2024') {
            setError('Hostel Secret Code is Incorrect!');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout( async () => {
            setIsLoading(false);
            try {
                if(formData.Role==='student'){


                  await axios.post('https://srinidhihostelsbackend.onrender.com/api/students/studentregistration', {
                        StudentRoomNumber: formData.StudentRoomNumber, // Placeholder, adjust as needed
                        StudentName: formData.StudentName,
                        email: formData.email,
                        Role: formData.Role,
                        password: formData.password
                    });

                 }else{

                      await axios.post('https://srinidhihostelsbackend.onrender.com/api/students/studentregistration', {
                         StudentRoomNumber: '001', // Management doesn't need room number
                        StudentName: formData.StudentName,
                        email: formData.email,
                        Role: formData.Role,
                        password: formData.password
                    });
                 }
           } catch (error) {
            // Check if student already exists
            if (error.response && error.response.status === 400 && error.response.data.message === 'Student already exists') {
                setError('✗ This email is already registered. Please login or use a different email.');
            } else if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
            return;
           }
               setSuccess('✓ Registration successful! Redirecting to login...');
                        setTimeout(()=>{
                            navigate('/login');
                        },1500);
        }, 1500);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        Srinidhi<span className="text-gradient">Hostels</span>
                    </Link>
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Simple and quick registration</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                     
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="StudentName"
                            name="StudentName"
                            placeholder="Enter your full name"
                            value={formData.StudentName}
                            onChange={handleChange}
                            required
                            autoFocus
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                        <p className='text-sm'>You will recieve OTP's in the time changing your password</p>
                    </div>

                    <div className="form-group">
                        <label>Select Role</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="Role"
                                    value="student"
                                    checked={formData.Role === 'student'}
                                    onChange={handleChange}
                                />
                                Student
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="Role"
                                    value="admin"
                                    checked={formData.Role === 'admin'}
                                    onChange={handleChange}
                                />
                                Management
                            </label>
                        </div>
                    </div>

                    {formData.Role === 'admin' && (
                        <div className="form-group">
                            <label htmlFor="secretCode">Hostel Secret Code</label>
                            <input
                                type="text"
                                id="secretCode"
                                name="secretCode"
                                placeholder="Enter hostel secret code"
                                value={formData.secretCode}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                    )}

                    {
                        formData.Role === 'student' &&(
                                <div className="form-group">
                        <label htmlFor="name">Enter Room Number</label>
                        <input
                            type="text"
                            id="StudentRoomNumber"
                            name="StudentRoomNumber"
                            placeholder="Enter your room number"
                            value={formData.StudentRoomNumber}
                            onChange={handleChange}
                            required
                            autoFocus
                            className="form-input"
                        />
                    </div>
                        )
                      
                    }

                    <div className="form-group">
                        <label htmlFor="password">Create Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Use at least 6 characters"
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
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    {success && <div className="success-message">{success}</div>}
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn-auth" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
