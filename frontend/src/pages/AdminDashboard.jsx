import React, { useState, useEffect, use } from 'react';
import { Menu, LogOut, Edit2, Trash2, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import Navbar from '../components/Navbar';
import AddStudent from '../components/AddStudent';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const Api="https://srinidhihostelsbackend.onrender.com/";

    useEffect(() => {
        // Fetch students from backend
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`${Api}api/students/allstudents`);
                console.log(response);
                if (response.status == 200) {
                    setStudents(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        const checkLogin = () => {
            const storedUser = sessionStorage.getItem('user');
            if (!storedUser) {
                alert("Please login to access your details");
                navigate("/login");
                return;
            }
            const user = JSON.parse(storedUser);
            if (user.role.toLowerCase() !== "admin") {
                alert("Access denied. Admins only.");
                navigate("/");
                return;
            }
        };

        const timer = setTimeout(checkLogin, 800);
        return () => clearTimeout(timer);
    }, [navigate]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`${Api}api/students/deletestudent/${id}`);
                setDeleted(true);
                setTimeout(() => setDeleted(false), 3000);
                //refresh the after deletion
                window.location.reload();
            } catch (error) {
                setError('Failed to delete student. Please try again.');
            }
        }
    };

    const handleEdit = (student) => {
        setCurrentStudent({ ...student });
        setEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            await axios.put(`${Api}api/students/updatestudent/${currentStudent._id}`, currentStudent);
            setEditModalOpen(false);
            // Refresh student list
            const response = await axios.get(`${Api}api/students/allstudents`);
            if (response.status === 200) {
                setStudents(response.data.data);
            }
            alert('Student updated successfully!');
        } catch (error) {
            console.error('Error updating student:', error);
            alert('Failed to update student.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="admin-dashboard">
            {/* Navigation */}
            <br />
            <Navbar />

            {/* Header */}
            <header className="dashboard-header container">
                <div>
                    <h1 className="dashboard-title">Hostel Management Dashboard</h1>
                    <p className="dashboard-subtitle">Manage students, rooms, and payments easily</p>
                </div>
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-value">{students.length}</span>
                        <span className="stat-label">Total Students</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">12</span>
                        <span className="stat-label">Rooms Occupied</span>
                    </div>
                </div>
            </header>

            {/* Add Student Form */}
            <AddStudent />

            {/* Unpaid Students Section */}
            <section className="dashboard-section unpaid-section container">
                <h2 className="section-header">Unpaid Students (This Month)</h2>
                <div className="table-container">
                    <table className="data-table unpaid-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Room No</th>
                                <th>Amount Due</th>
                                <th>Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Anil</td>
                                <td>203</td>
                                <td>₹6000</td>
                                <td>98XXXXXX12</td>
                            </tr>
                            <tr>
                                <td>Kiran</td>
                                <td>105</td>
                                <td>₹4500</td>
                                <td>91XXXXXX34</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Student Details Table */}
            <section className="dashboard-section container">
                <h2 className="section-header">Student Details</h2>
                {deleted && <p style={{ color: 'green', marginBottom: '1rem' }}>✓ Student deleted successfully!</p>}
                {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                        {/* <div>
                            <input type="text" placeholder="Search" />
                            <button>Search</button>

                        </div> */}
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Room</th>
                                <th>Sharing</th>
                                <th>Start Date</th>
                                <th>Amount</th>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>College</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {students.map((student, index) => (
                                <tr key={student._id}>
                                    <td>{index + 1}</td>
                                    <td>{student.RoomNumber}</td>
                                    <td>{student.Sharing}-sharing</td>
                                    <td>{new Date(student.StartingDate).toISOString().split('T')[0]}</td>
                                    <td>₹{student.AmountPerMonth}</td>
                                    <td>{student.StudentName}</td>
                                    <td>{student.Mobilenumber}</td>
                                    <td>{student.CollegeName}</td>
                                    <td>
                                        <button className="action-btn edit" onClick={() => handleEdit(student)} title="Edit"><Edit2 size={18} /></button>
                                        <button className="action-btn delete" onClick={() => handleDelete(student._id)} title="Delete"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Footer */}
            <footer className="container" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                <p>© 2025 Srinidhi Hostels | All Rights Reserved</p>
            </footer>

            {/* Edit Student Modal */}
            {editModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Edit Student Details</h3>
                            <button className="close-btn" onClick={() => setEditModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleUpdate} className="edit-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Student Name</label>
                                    <input
                                        type="text"
                                        value={currentStudent.StudentName}
                                        onChange={(e) => setCurrentStudent({ ...currentStudent, StudentName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Room Number</label>
                                    <input
                                        type="text"
                                        value={currentStudent.RoomNumber}
                                        onChange={(e) => setCurrentStudent({ ...currentStudent, RoomNumber: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Sharing</label>
                                    <select
                                        value={currentStudent.Sharing}
                                        onChange={(e) => setCurrentStudent({ ...currentStudent, Sharing: e.target.value })}
                                    >
                                        <option value="1">1-sharing</option>
                                        <option value="2">2-sharing</option>
                                        <option value="3">3-sharing</option>
                                        <option value="4">4-sharing</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Amount Per Month</label>
                                    <input
                                        type="text"
                                        value={currentStudent.AmountPerMonth}
                                        onChange={(e) => setCurrentStudent({ ...currentStudent, AmountPerMonth: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number</label>
                                    <input
                                        type="text"
                                        value={currentStudent.Mobilenumber}
                                        onChange={(e) => setCurrentStudent({ ...currentStudent, Mobilenumber: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>College Name</label>
                                    <input
                                        type="text"
                                        value={currentStudent.CollegeName}
                                        onChange={(e) => setCurrentStudent({ ...currentStudent, CollegeName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Course & Year</label>
                                    <input
                                        type="text"
                                        value={currentStudent.CourseNameandYear}
                                        onChange={(e) => setCurrentStudent({ ...currentStudent, CourseNameandYear: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={currentStudent.Email}
                                        onChange={(e) => setCurrentStudent({ ...currentStudent, Email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Parent's Mobile</label>
                                    <input
                                        type="text"
                                        value={currentStudent.PMobilenumber}
                                        onChange={(e) => setCurrentStudent({ ...currentStudent, PMobilenumber: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label>Address</label>
                                    <textarea
                                        value={currentStudent.Address}
                                        onChange={(e) => setCurrentStudent({ ...currentStudent, Address: e.target.value })}
                                        required
                                        rows="2"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)' }}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={updateLoading}>
                                    {updateLoading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
